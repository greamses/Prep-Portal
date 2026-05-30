// ===========================================================================
// LEARNING VIDEO - per-topic YouTube lesson. The search runs SERVER-SIDE on the
// public /api/grammar/video endpoint (Gemini plans the query, YouTube finds the
// video) using the app's Vercel env keys - so it works for every visitor with
// no sign-in. Clicks never flip the page; a page-flip stops any playing video.
// ===========================================================================

const API_BASE = window.location.port === "5500" ? "http://127.0.0.1:5000" : "";
const _cache = {};

// Find the best video for a topic via the public endpoint (cached).
async function findVideo(topic) {
  if (_cache[topic]) return _cache[topic];
  const res = await fetch(`${API_BASE}/api/grammar/video?topic=${encodeURIComponent(topic)}`);
  if (!res.ok) throw new Error(`video ${res.status}`);
  const data = await res.json();
  const out = data.video
    ? { ...data.video }
    : { search: data.search, channel: data.channel };
  _cache[topic] = out;
  return out;
}

function esc(s) {
  return String(s || "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
}

// Wire one [data-gp-topic-video] card (event-delegated so restored / retry
// buttons keep working).
export function wireTopicVideo(card) {
  if (!card || card.dataset.wired) return;
  card.dataset.wired = "1";
  const topic = card.dataset.topic || "";
  const stage = card.querySelector(".gp-tvid__stage");

  // Nothing inside the card should ever flip the page.
  ["mousedown", "touchstart"].forEach((ev) =>
    card.addEventListener(ev, (e) => e.stopPropagation(), { passive: true })
  );

  card.addEventListener("click", async (e) => {
    e.stopPropagation();

    const poster = e.target.closest(".gp-tvid__poster");
    if (poster) {
      stage.innerHTML = `<iframe class="gp-vid-frame" src="${poster.dataset.embed}&autoplay=1" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen frameborder="0"></iframe>`;
      return;
    }

    const playBtn = e.target.closest("[data-gp-vid-play]");
    if (!playBtn || card.dataset.loading) return;
    card.dataset.loading = "1";
    stage.innerHTML = `<div class="gp-tvid__loading"><span class="gp-tvid__spin"></span>Finding a lesson video...</div>`;
    try {
      const v = await findVideo(topic);
      if (v.embedUrl) {
        stage.innerHTML = `
          <div class="gp-tvid__poster" data-embed="${esc(v.embedUrl)}" role="button" tabindex="0" aria-label="Play ${esc(v.title)}">
            <img src="${esc(v.thumb)}" alt="" loading="lazy">
            <span class="gp-tvid__play"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg></span>
            <span class="gp-tvid__cap">${esc(v.title)} - ${esc(v.channel)}</span>
          </div>`;
      } else {
        stage.innerHTML = `<a class="gp-tvid__searchlink" href="${esc(v.search)}" target="_blank" rel="noopener" onclick="event.stopPropagation()">Search ${esc(v.channel)} on YouTube</a>`;
      }
    } catch {
      stage.innerHTML = `<p class="gp-tvid__err">Couldn't load a video. <button type="button" class="gp-tvid__btn" data-gp-vid-play>Retry</button></p>`;
    } finally {
      card.dataset.loading = "";
    }
  });
}

// Stop/remove every playing video under root (called on page flip + close).
export function stopAllVideos(root) {
  root?.querySelectorAll(".gp-vid-frame").forEach((f) => {
    const stage = f.closest(".gp-tvid__stage");
    f.remove();
    if (stage && !stage.children.length) {
      stage.innerHTML = `<button type="button" class="gp-tvid__btn" data-gp-vid-play>Watch a lesson video</button>`;
    }
  });
}
