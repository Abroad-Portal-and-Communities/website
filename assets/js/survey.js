(function () {
  const STORAGE_KEY = "apc-survey-v2";

  function i18n(key, fallback) {
    const bag = window.__APC_SURVEY_I18N || {};
    return bag[key] || fallback;
  }

  function format(template) {
    const args = Array.prototype.slice.call(arguments, 1);
    return template.replace(/%s/g, function () {
      return args.length ? String(args.shift()) : "";
    });
  }

  function ready(fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }

  function cleanCredential(value) {
    return (value || "").trim().replace(/^["']+|["']+$/g, "");
  }

  function readConfig() {
    if (window.__APC_SURVEY_CONFIG) {
      return {
        supabaseUrl: cleanCredential(window.__APC_SURVEY_CONFIG.supabaseUrl),
        supabaseAnonKey: cleanCredential(window.__APC_SURVEY_CONFIG.supabaseAnonKey),
      };
    }
    return { supabaseUrl: "", supabaseAnonKey: "" };
  }

  function normalizeSupabaseUrl(url) {
    const trimmed = (url || "").trim().replace(/\/$/, "");
    if (!/^https:\/\/[a-z0-9]+\.supabase\.co$/i.test(trimmed)) {
      throw new Error(
        "Invalid Project URL. Use https://YOUR_REF.supabase.co from Supabase → Settings → API (not the database connection string)."
      );
    }
    return trimmed;
  }

  function getRadio(form, name) {
    const input = form.querySelector('input[name="' + name + '"]:checked');
    if (!input) return null;
    return {
      id: input.value,
      label: input.dataset.label || input.value,
      link: input.dataset.link || "",
      isOther: input.dataset.other === "true",
    };
  }

  function getCheckedList(form, name) {
    return Array.prototype.map.call(
      form.querySelectorAll('input[name="' + name + '"]:checked'),
      function (input) {
        return {
          id: input.value,
          label: input.dataset.label || input.value,
          link: input.dataset.link || "",
        };
      }
    );
  }

  function setRadio(form, name, id) {
    const input = form.querySelector('input[name="' + name + '"][value="' + id + '"]');
    if (input) input.checked = true;
  }

  function setStatus(el, message, isError) {
    if (!el) return;
    if (!message) {
      el.hidden = true;
      el.textContent = "";
      return;
    }
    el.hidden = false;
    el.textContent = message;
    el.classList.toggle("apc-survey__status--error", !!isError);
  }

  function uniqueLinks(items) {
    const seen = {};
    const out = [];
    items.forEach(function (item) {
      if (!item.link || seen[item.link]) return;
      seen[item.link] = true;
      out.push(item);
    });
    return out;
  }

  function collectAnswers(form) {
    const status = getRadio(form, "status");
    const continent = getRadio(form, "continent");
    const job = getRadio(form, "job");
    const lookingFor = getCheckedList(form, "looking_for");
    const statusDetailEl = form.querySelector("#apc-survey-status-detail");
    const countryEl = form.querySelector("#apc-survey-country");
    const jobOtherEl = form.querySelector("#apc-survey-job-other");
    const statusDetail = statusDetailEl ? statusDetailEl.value.trim() : "";
    const country = countryEl ? countryEl.value.trim() : "";
    const jobOther = jobOtherEl ? jobOtherEl.value.trim() : "";

    if (!status || !continent || !job) return null;
    if (!statusDetail) return null;
    if (!continent.id) return null;
    if (!country) return null;
    if (lookingFor.length === 0) return null;
    if (job.isOther && !jobOther) return null;

    const jobLabel = job.isOther && jobOther ? jobOther : job.label;

    return {
      status: status,
      statusDetail: statusDetail,
      continent: continent,
      country: country,
      job: job,
      jobLabel: jobLabel,
      jobOther: job.isOther ? jobOther : "",
      lookingFor: lookingFor,
    };
  }

  function buildRecommendations(data) {
    const links = [];

    links.push({
      label: format(i18n("recWorkingAbroad", "Working abroad: %s"), data.continent.label),
      link: data.continent.link,
    });

    links.push({
      label: format(i18n("recCareer", "Career guide: %s"), data.jobLabel),
      link: data.job.link,
    });

    data.lookingFor.forEach(function (item) {
      links.push({ label: item.label, link: item.link });
    });

    return uniqueLinks(links);
  }

  function saveLocal(data) {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          status: data.status.id,
          statusDetail: data.statusDetail,
          continent: data.continent.id,
          country: data.country,
          job: data.job.id,
          jobOther: data.jobOther,
          lookingFor: data.lookingFor.map(function (x) {
            return x.id;
          }),
        })
      );
    } catch (_) {
      /* ignore */
    }
  }

  function saveToSupabase(cfg, data) {
    const key = (cfg.supabaseAnonKey || "").trim();
    if (!cfg.supabaseUrl || !key) return Promise.resolve("local");

    let url;
    try {
      url = normalizeSupabaseUrl(cfg.supabaseUrl);
    } catch (err) {
      return Promise.reject(err);
    }

    const payload = {
      status_id: data.status.id,
      status_label: data.status.label,
      status_detail_text: data.statusDetail,
      continent_id: data.continent.id,
      continent_label: data.continent.label,
      country_text: data.country,
      job_id: data.job.id,
      job_label: data.jobLabel,
      job_other_text: data.jobOther || null,
      looking_for: data.lookingFor.map(function (x) {
        return { id: x.id, label: x.label };
      }),
      page_path: window.location.pathname || null,
    };

    return fetch(url + "/rest/v1/survey_responses", {
      method: "POST",
      mode: "cors",
      credentials: "omit",
      headers: {
        apikey: key,
        Authorization: "Bearer " + key,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify(payload),
    })
      .then(function (res) {
        if (res.ok) return "saved";
        return res.text().then(function (body) {
          const msg = (body || "").slice(0, 240);
          throw new Error(String(res.status) + (msg ? ": " + msg : ""));
        });
      })
      .catch(function (err) {
        if (err && err.message && err.message.indexOf("Invalid Project URL") === 0) {
          throw err;
        }
        if (err && err.message && /^\d{3}:/.test(err.message)) {
          throw err;
        }
        throw new Error(
          "Network blocked or wrong URL (Load failed). Use Project URL https://YOUR_REF.supabase.co, ensure the Supabase project is active, disable ad blockers, and retry."
        );
      });
  }

  function renderResults(data, summaryEl, listEl) {
    const parts = [
      format(i18n("summaryStatus", "Status: %s (%s)"), data.status.label, data.statusDetail),
      format(i18n("summaryTarget", "Target: %s — %s"), data.continent.label, data.country),
      format(i18n("summaryRole", "Role: %s"), data.jobLabel),
      format(
        i18n("summaryTopics", "Topics: %s"),
        data.lookingFor
          .map(function (x) {
            return x.label;
          })
          .join(", ")
      ),
    ];
    summaryEl.textContent = parts.join(" · ");

    listEl.innerHTML = "";
    buildRecommendations(data).forEach(function (item) {
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.className = "apc-survey__result-link";
      a.href = item.link;
      a.textContent = item.label;
      li.appendChild(a);
      listEl.appendChild(li);
    });
  }

  function showResults(form, results, data, summaryEl, listEl) {
    renderResults(data, summaryEl, listEl);
    form.hidden = true;
    results.hidden = false;
    saveLocal(data);
  }

  function showForm(form, results, status) {
    form.hidden = false;
    results.hidden = true;
    setStatus(status, "", false);
  }

  function toggleStatusDetailWrap(form) {
    const wrap = document.getElementById("apc-status-detail-wrap");
    const detail = form.querySelector("#apc-survey-status-detail");
    const status = getRadio(form, "status");
    if (!wrap || !detail) return;
    if (status) {
      wrap.hidden = false;
      detail.required = true;
    } else {
      wrap.hidden = true;
      detail.required = false;
      detail.value = "";
    }
  }

  function toggleCountryWrap(form) {
    const wrap = document.getElementById("apc-country-wrap");
    const country = form.querySelector("#apc-survey-country");
    const continent = getRadio(form, "continent");
    if (!wrap || !country) return;
    if (continent) {
      wrap.hidden = false;
      country.required = true;
    } else {
      wrap.hidden = true;
      country.required = false;
      country.value = "";
    }
  }

  function toggleJobOtherWrap(form) {
    const wrap = document.getElementById("apc-job-other-wrap");
    const other = form.querySelector("#apc-survey-job-other");
    const job = getRadio(form, "job");
    if (!wrap || !other) return;
    if (job && job.isOther) {
      wrap.hidden = false;
      other.required = true;
    } else {
      wrap.hidden = true;
      other.required = false;
      other.value = "";
    }
  }

  function restoreForm(form, saved) {
    setRadio(form, "status", saved.status);
    setRadio(form, "continent", saved.continent);
    setRadio(form, "job", saved.job);
    const statusDetail = form.querySelector("#apc-survey-status-detail");
    if (statusDetail) statusDetail.value = saved.statusDetail || "";
    const country = form.querySelector("#apc-survey-country");
    if (country) country.value = saved.country || "";
    const jobOther = form.querySelector("#apc-survey-job-other");
    if (jobOther) jobOther.value = saved.jobOther || "";
    if (saved.lookingFor) {
      saved.lookingFor.forEach(function (id) {
        const cb = form.querySelector('input[name="looking_for"][value="' + id + '"]');
        if (cb) cb.checked = true;
      });
    }
    toggleStatusDetailWrap(form);
    toggleCountryWrap(form);
    toggleJobOtherWrap(form);
  }

  ready(function () {
    const form = document.getElementById("apc-survey-form");
    const results = document.getElementById("apc-survey-results");
    if (!form || !results) return;

    const cfg = readConfig();
    const summary = document.getElementById("apc-survey-summary");
    const list = document.getElementById("apc-survey-result-list");
    const reset = document.getElementById("apc-survey-reset");
    const status = document.getElementById("apc-survey-status");
    const submitBtn = form.querySelector(".apc-survey__submit");

    form.addEventListener("change", function (e) {
      if (e.target.name === "status") toggleStatusDetailWrap(form);
      if (e.target.name === "continent") toggleCountryWrap(form);
      if (e.target.name === "job") toggleJobOtherWrap(form);
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const data = collectAnswers(form);
      if (!data) {
        setStatus(status, i18n("errorRequired", "Please complete all required fields."), true);
        return;
      }

      if (submitBtn) submitBtn.disabled = true;
      setStatus(status, i18n("saving", "Saving…"), false);

      const hasDb = !!(cfg.supabaseUrl && cfg.supabaseAnonKey);

      saveToSupabase(cfg, data)
        .then(function (mode) {
          showResults(form, results, data, summary, list);
          if (mode === "saved") {
            setStatus(
              status,
              i18n("saved", "Thanks — your response was saved to the database."),
              false
            );
          } else if (!hasDb) {
            setStatus(
              status,
              i18n(
                "noDb",
                "Guides are shown below. Database not configured for this site build (add Supabase URL and Publishable key)."
              ),
              true
            );
          }
        })
        .catch(function (err) {
          showResults(form, results, data, summary, list);
          setStatus(
            status,
            i18n("saveFailed", "Could not save to the database") +
              (err && err.message ? " (" + err.message + ")." : ".") +
              " Check Supabase schema (migration-upgrade-to-v2.sql) and table RLS.",
            true
          );
        })
        .finally(function () {
          if (submitBtn) submitBtn.disabled = false;
        });
    });

    reset.addEventListener("click", function () {
      form.reset();
      toggleStatusDetailWrap(form);
      toggleCountryWrap(form);
      toggleJobOtherWrap(form);
      showForm(form, results, status);
    });

    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
      if (saved && saved.status && saved.continent && saved.job) {
        restoreForm(form, saved);
        const data = collectAnswers(form);
        if (data) {
          showResults(form, results, data, summary, list);
        }
      }
    } catch (_) {
      /* ignore */
    }
  });
})();
