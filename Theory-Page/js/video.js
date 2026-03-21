/* ════════════════════════════════════════
   video.js
════════════════════════════════════════ */
import { state } from '../state.js';

const _videoCache = {};

const _VIDEO_MODELS = [
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent',
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent',
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent',
];

function _isMathSubject(subject) {
  return /math|maths|further math/i.test(subject);
}

/* ════════════════════════════════════════
   CHANNEL MAP
════════════════════════════════════════ */
function _getChannels(subject, level) {
  const isLowerPrim = /primary [123]|pry [123]/i.test(level);
  const isUpperPrim = /primary [456]|pry [456]/i.test(level);
  const isPrimary   = isLowerPrim || isUpperPrim;
  const isJSS       = /jss/i.test(level);

  if (/further math/i.test(subject)) return [
    { name: '3Blue1Brown',                  handle: '3blue1brown'                  },
    { name: 'blackpenredpen',               handle: 'blackpenredpen'               },
    { name: 'Mathologer',                   handle: 'mathologer'                   },
    { name: 'Eddie Woo',                    handle: 'misterwootube'                },
    { name: 'Professor Leonard',            handle: 'professorleonard'             },
  ];
  if (/math/i.test(subject) && isLowerPrim) return [
    { name: 'Numberblocks',                 handle: 'learningblocks'               },
    { name: 'Peekaboo Kidz',                handle: 'peekabookidz'                 },
    { name: 'Smile and Learn',              handle: 'smileandlearn'                },
    { name: 'Math Antics',                  handle: 'mathantics'                   },
    { name: 'Scratch Garden',               handle: 'scratchgarden'                },
    { name: 'Miacademy Learning',           handle: 'miacademy'                    },
    { name: 'Onlock Learning',              handle: 'onlocklearning'               },
    { name: 'Jack Hartmann',                handle: 'jackhartmannkidsmusic'        },
  ];
  if (/math/i.test(subject) && isUpperPrim) return [
    { name: 'Math Antics',                  handle: 'mathantics'                   },
    { name: 'Miacademy Learning',           handle: 'miacademy'                    },
    { name: 'Onlock Learning',              handle: 'onlocklearning'               },
    { name: 'Smile and Learn',              handle: 'smileandlearn'                },
    { name: 'Numberphile',                  handle: 'numberphile'                  },
    { name: 'Khan Academy',                 handle: 'khanacademy'                  },
  ];
  if (/math/i.test(subject) && isJSS) return [
    { name: 'Math Antics',                  handle: 'mathantics'                   },
    { name: 'Khan Academy',                 handle: 'khanacademy'                  },
    { name: 'Onlock Learning',              handle: 'onlocklearning'               },
    { name: 'Eddie Woo',                    handle: 'misterwootube'                },
    { name: 'Numberphile',                  handle: 'numberphile'                  },
    { name: 'TabletClass Math',             handle: 'tabletclassmath'              },
  ];
  if (/math/i.test(subject)) return [
    { name: 'blackpenredpen',               handle: 'blackpenredpen'               },
    { name: '3Blue1Brown',                  handle: '3blue1brown'                  },
    { name: 'Khan Academy',                 handle: 'khanacademy'                  },
    { name: 'Eddie Woo',                    handle: 'misterwootube'                },
    { name: 'Professor Leonard',            handle: 'professorleonard'             },
    { name: 'The Organic Chemistry Tutor',  handle: 'theorganicchemistrytutorm'    },
  ];

  if (/physics/i.test(subject) && isPrimary) return [
    { name: 'SciShow Kids',                 handle: 'scishowkids'                  },
    { name: "It's AumSum",                  handle: 'aumsum'                       },
    { name: 'Peekaboo Kidz',                handle: 'peekabookidz'                 },
    { name: 'Kurzgesagt',                   handle: 'kurzgesagt'                   },
    { name: 'Smile and Learn',              handle: 'smileandlearn'                },
  ];
  if (/physics/i.test(subject)) return [
    { name: 'Veritasium',                   handle: 'veritasium'                   },
    { name: 'MinutePhysics',                handle: 'minutephysics'                },
    { name: 'Physics Girl',                 handle: 'physicsgirl'                  },
    { name: 'The Organic Chemistry Tutor',  handle: 'theorganicchemistrytutorm'    },
    { name: 'Flipping Physics',             handle: 'flippingphysics'              },
  ];

  if (/chemistry/i.test(subject) && isPrimary) return [
    { name: "It's AumSum",                  handle: 'aumsum'                       },
    { name: 'SciShow Kids',                 handle: 'scishowkids'                  },
    { name: 'Peekaboo Kidz',                handle: 'peekabookidz'                 },
    { name: 'Kurzgesagt',                   handle: 'kurzgesagt'                   },
  ];
  if (/chemistry/i.test(subject)) return [
    { name: 'Tyler DeWitt',                 handle: 'tylerdewitt'                  },
    { name: 'NileRed',                      handle: 'nilered'                      },
    { name: 'The Organic Chemistry Tutor',  handle: 'theorganicchemistrytutorm'    },
    { name: 'Periodic Videos',              handle: 'periodicvideos'               },
    { name: 'Professor Dave',               handle: 'professordaveexplains'        },
  ];

  if (/biology/i.test(subject) && isPrimary) return [
    { name: 'SciShow Kids',                 handle: 'scishowkids'                  },
    { name: 'Peekaboo Kidz',                handle: 'peekabookidz'                 },
    { name: 'Kurzgesagt',                   handle: 'kurzgesagt'                   },
    { name: "It's AumSum",                  handle: 'aumsum'                       },
    { name: 'National Geographic Kids',     handle: 'natgeokids'                   },
  ];
  if (/biology/i.test(subject)) return [
    { name: 'Amoeba Sisters',               handle: 'amoebasisters'                },
    { name: 'Kurzgesagt',                   handle: 'kurzgesagt'                   },
    { name: 'Professor Dave',               handle: 'professordaveexplains'        },
    { name: 'Stated Clearly',               handle: 'statedclearly'                },
    { name: 'BioMan Biology',               handle: 'biomanbio'                    },
  ];

  if (/basic science/i.test(subject) && isPrimary) return [
    { name: 'SciShow Kids',                 handle: 'scishowkids'                  },
    { name: 'Peekaboo Kidz',                handle: 'peekabookidz'                 },
    { name: "It's AumSum",                  handle: 'aumsum'                       },
    { name: 'Smile and Learn',              handle: 'smileandlearn'                },
    { name: 'Onlock Learning',              handle: 'onlocklearning'               },
    { name: 'National Geographic Kids',     handle: 'natgeokids'                   },
    { name: 'Miacademy Learning',           handle: 'miacademy'                    },
  ];
  if (/basic science/i.test(subject)) return [
    { name: 'Kurzgesagt',                   handle: 'kurzgesagt'                   },
    { name: 'SciShow',                      handle: 'scishow'                      },
    { name: 'Amoeba Sisters',               handle: 'amoebasisters'                },
    { name: "It's AumSum",                  handle: 'aumsum'                       },
    { name: 'Veritasium',                   handle: 'veritasium'                   },
  ];

  if (/english/i.test(subject) && isLowerPrim) return [
    { name: 'Alphablocks',                  handle: 'learningblocks'               },
    { name: 'Grammar Songs by Melissa',     handle: 'grammarsongsmelissa'          },
    { name: 'Scratch Garden',               handle: 'scratchgarden'                },
    { name: 'Onlock Learning',              handle: 'onlocklearning'               },
    { name: 'Jack Hartmann',                handle: 'jackhartmannkidsmusic'        },
    { name: 'Smile and Learn',              handle: 'smileandlearn'                },
    { name: 'Miacademy Learning',           handle: 'miacademy'                    },
    { name: 'Peekaboo Kidz',                handle: 'peekabookidz'                 },
  ];
  if (/english/i.test(subject) && isUpperPrim) return [
    { name: 'Grammar Songs by Melissa',     handle: 'grammarsongsmelissa'          },
    { name: 'Scratch Garden',               handle: 'scratchgarden'                },
    { name: 'Onlock Learning',              handle: 'onlocklearning'               },
    { name: 'English Tree TV',              handle: 'englishteetv'                 },
    { name: 'Miacademy Learning',           handle: 'miacademy'                    },
    { name: 'BBC Bitesize',                 handle: 'bbcbitesize'                  },
    { name: 'Smile and Learn',              handle: 'smileandlearn'                },
  ];
  if (/english/i.test(subject) && isJSS) return [
    { name: 'TED-Ed',                       handle: 'teded'                        },
    { name: 'Grammar Songs by Melissa',     handle: 'grammarsongsmelissa'          },
    { name: 'Onlock Learning',              handle: 'onlocklearning'               },
    { name: 'CrashCourse',                  handle: 'crashcourse'                  },
    { name: 'BBC Bitesize',                 handle: 'bbcbitesize'                  },
    { name: 'English with Lucy',            handle: 'englishwithlucy'              },
  ];
  if (/english/i.test(subject)) return [
    { name: 'TED-Ed',                       handle: 'teded'                        },
    { name: 'CrashCourse',                  handle: 'crashcourse'                  },
    { name: 'English with Lucy',            handle: 'englishwithlucy'              },
    { name: 'Merriam-Webster',              handle: 'merriamwebster'               },
    { name: 'BBC Learning English',         handle: 'bbclearningenglish'           },
  ];

  if (/literature/i.test(subject)) return [
    { name: 'TED-Ed',                       handle: 'teded'                        },
    { name: 'CrashCourse',                  handle: 'crashcourse'                  },
    { name: 'The School of Life',           handle: 'theschooloflifetv'            },
    { name: 'Overly Sarcastic Productions', handle: 'overlysarcasticproductions'   },
    { name: 'Like Stories of Old',          handle: 'likestoriesofold'             },
  ];
  if (/government|civic/i.test(subject)) return [
    { name: 'CrashCourse',                  handle: 'crashcourse'                  },
    { name: 'TED-Ed',                       handle: 'teded'                        },
    { name: 'CGP Grey',                     handle: 'cgpgrey'                      },
    { name: 'PolyMatter',                   handle: 'polymatter'                   },
    { name: 'Overly Sarcastic Productions', handle: 'overlysarcasticproductions'   },
  ];
  if (/history/i.test(subject)) return [
    { name: 'Overly Sarcastic Productions', handle: 'overlysarcasticproductions'   },
    { name: 'Kings and Generals',           handle: 'kingsandgenerals'             },
    { name: 'CrashCourse',                  handle: 'crashcourse'                  },
    { name: 'Toldinstone',                  handle: 'toldinstone'                  },
    { name: 'Fall of Civilizations',        handle: 'fallofcivilizationspodcast'   },
    { name: 'Historia Civilis',             handle: 'historiacivilis'              },
  ];
  if (/economics/i.test(subject)) return [
    { name: 'ACDC Econ',                    handle: 'acdcecon'                     },
    { name: 'Economics Explained',          handle: 'economicsexplained'           },
    { name: 'CrashCourse',                  handle: 'crashcourse'                  },
    { name: 'Marginal Revolution University', handle: 'marginalu'                  },
    { name: 'PolyMatter',                   handle: 'polymatter'                   },
  ];
  if (/commerce|accounting|financial/i.test(subject)) return [
    { name: 'Accounting Stuff',             handle: 'accountingstuff'              },
    { name: 'ACDC Econ',                    handle: 'acdcecon'                     },
    { name: 'Edspira',                      handle: 'edspira'                      },
    { name: 'Khan Academy',                 handle: 'khanacademy'                  },
    { name: 'Two Teachers',                 handle: 'twoteachers'                  },
  ];

  if (/geography/i.test(subject) && isPrimary) return [
    { name: 'National Geographic Kids',     handle: 'natgeokids'                   },
    { name: 'Smile and Learn',              handle: 'smileandlearn'                },
    { name: 'SciShow Kids',                 handle: 'scishowkids'                  },
    { name: 'Geography Now',                handle: 'geographynow'                 },
  ];
  if (/geography/i.test(subject)) return [
    { name: 'Geography Now',                handle: 'geographynow'                 },
    { name: 'Real Life Lore',               handle: 'reallifelore'                 },
    { name: 'Wendover Productions',         handle: 'wendoverproductions'          },
    { name: 'GeoRussia',                    handle: 'georussia'                    },
    { name: 'Kurzgesagt',                   handle: 'kurzgesagt'                   },
  ];

  if (/social studies/i.test(subject) && isPrimary) return [
    { name: 'Smile and Learn',              handle: 'smileandlearn'                },
    { name: 'Peekaboo Kidz',                handle: 'peekabookidz'                 },
    { name: 'Onlock Learning',              handle: 'onlocklearning'               },
    { name: 'Miacademy Learning',           handle: 'miacademy'                    },
    { name: 'National Geographic Kids',     handle: 'natgeokids'                   },
    { name: 'TED-Ed',                       handle: 'teded'                        },
  ];
  if (/social studies/i.test(subject)) return [
    { name: 'TED-Ed',                       handle: 'teded'                        },
    { name: 'Kurzgesagt',                   handle: 'kurzgesagt'                   },
    { name: 'CrashCourse',                  handle: 'crashcourse'                  },
    { name: 'PolyMatter',                   handle: 'polymatter'                   },
  ];

  if (/computer|ict/i.test(subject) && isLowerPrim) return [
    { name: 'Code.org',                     handle: 'codeorg'                      },
    { name: 'Hopscotch',                    handle: 'hopscotch'                    },
    { name: 'Scratch Team',                 handle: 'scratch'                      },
    { name: 'Onlock Learning',              handle: 'onlocklearning'               },
    { name: 'Smile and Learn',              handle: 'smileandlearn'                },
    { name: 'CS Unplugged',                 handle: 'csunplugged'                  },
  ];
  if (/computer|ict/i.test(subject) && isUpperPrim) return [
    { name: 'Code.org',                     handle: 'codeorg'                      },
    { name: 'Hopscotch',                    handle: 'hopscotch'                    },
    { name: 'Scratch Team',                 handle: 'scratch'                      },
    { name: 'Onlock Learning',              handle: 'onlocklearning'               },
    { name: 'Miacademy Learning',           handle: 'miacademy'                    },
    { name: 'TED-Ed',                       handle: 'teded'                        },
  ];
  if (/computer|ict/i.test(subject) && isJSS) return [
    { name: 'Code.org',                     handle: 'codeorg'                      },
    { name: 'CS50 Harvard',                 handle: 'cs50'                         },
    { name: 'Computerphile',                handle: 'computerphile'                },
    { name: 'Khan Academy',                 handle: 'khanacademy'                  },
    { name: 'Fireship',                     handle: 'fireship'                     },
  ];
  if (/computer|ict/i.test(subject)) return [
    { name: 'Fireship',                     handle: 'fireship'                     },
    { name: 'CS50 Harvard',                 handle: 'cs50'                         },
    { name: 'Computerphile',                handle: 'computerphile'                },
    { name: 'Traversy Media',               handle: 'traversymedia'                },
    { name: 'NetworkChuck',                 handle: 'networkchuck'                 },
    { name: 'TechWorld with Nana',          handle: 'techworldwithnana'            },
  ];

  if (/agricultural|agric/i.test(subject) && isPrimary) return [
    { name: 'SciShow Kids',                 handle: 'scishowkids'                  },
    { name: 'National Geographic Kids',     handle: 'natgeokids'                   },
    { name: 'Smile and Learn',              handle: 'smileandlearn'                },
  ];
  if (/agricultural|agric/i.test(subject)) return [
    { name: 'Real Agriculture',             handle: 'realagriculture'              },
    { name: 'Practical Engineering',        handle: 'practicalengineeringchannel'  },
    { name: 'Khan Academy',                 handle: 'khanacademy'                  },
    { name: 'FAO',                          handle: 'unfao'                        },
  ];
  if (/business|marketing/i.test(subject)) return [
    { name: 'CrashCourse',                  handle: 'crashcourse'                  },
    { name: 'ACDC Econ',                    handle: 'acdcecon'                     },
    { name: 'TED-Ed',                       handle: 'teded'                        },
    { name: 'Patrick Dang',                 handle: 'patrickdang'                  },
    { name: 'HubSpot Marketing',            handle: 'hubspot'                      },
  ];
  if (/home economics|home ec/i.test(subject)) return [
    { name: 'Smile and Learn',              handle: 'smileandlearn'                },
    { name: 'SciShow Kids',                 handle: 'scishowkids'                  },
    { name: 'Khan Academy',                 handle: 'khanacademy'                  },
  ];
  if (/fine art|creative art/i.test(subject)) return [
    { name: 'The Art Assignment',           handle: 'theartassignment'             },
    { name: 'Proko',                        handle: 'proko'                        },
    { name: 'Drawfee Show',                 handle: 'drawfeeshow'                  },
    { name: 'Nerdforge',                    handle: 'nerdforge'                    },
  ];

  return [
    { name: 'Kurzgesagt',                   handle: 'kurzgesagt'                   },
    { name: 'TED-Ed',                       handle: 'teded'                        },
    { name: 'CrashCourse',                  handle: 'crashcourse'                  },
    { name: 'Onlock Learning',              handle: 'onlocklearning'               },
    { name: 'Smile and Learn',              handle: 'smileandlearn'                },
    { name: 'Peekaboo Kidz',                handle: 'peekabookidz'                 },
  ];
}

/* ════════════════════════════════════════
   GEMINI TOPIC PLANNING
════════════════════════════════════════ */
async function _fetchTopicData(questionText, subject, level) {
  const isMath    = _isMathSubject(subject);
  const mathExtra = isMath
    ? `\nAlso return up to 3 interactive math tools (Khan Academy, GeoGebra, Desmos, Mathway, Brilliant, CK-12) with direct URLs and 1 hands-on activity.`
    : '';
  const prompt = `You are an educational resource planner for Nigerian school students.
LEVEL: ${level}
SUBJECT: ${subject}
QUESTION: ${questionText}

Return a short topic label and 2 targeted YouTube search queries at ${level} level.${mathExtra}

Return ONLY valid JSON:
{
  "topicLabel": "<short topic>",
  "searches": [
    { "query": "<specific search query>", "angle": "<aspect covered>" },
    { "query": "<specific search query>", "angle": "<aspect covered>" }
  ]${isMath ? `,
  "interactive": [{ "name": "<tool>", "url": "<url>", "type": "practice|visualiser|game", "description": "<one sentence>" }],
  "manipulative": "<one sentence hands-on activity>"` : ''}
}`;

  for (const modelUrl of _VIDEO_MODELS) {
    try {
      const res = await fetch(`${modelUrl}?key=${encodeURIComponent(state.GEMINI_KEY)}`, {
        method : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body   : JSON.stringify({
          systemInstruction: { parts: [{ text: prompt }] },
          contents: [{ parts: [{ text: `Plan resources for: ${questionText}` }] }],
          generationConfig : { responseMimeType: 'application/json', temperature: 0.2, maxOutputTokens: 600 },
        }),
      });
      if (res.status === 429 || res.status === 503 || !res.ok) continue;
      const raw  = await res.json();
      const text = raw.candidates?.[0]?.content?.parts?.[0]?.text || '';
      const s = text.indexOf('{'), e = text.lastIndexOf('}');
      if (s < 0 || e < 0) continue;
      return JSON.parse(
        text.slice(s, e + 1)
          .replace(/\r\n/g,'\\n').replace(/\r/g,'\\n').replace(/\n/g,'\\n')
          .replace(/\t/g,'\\t').replace(/[\u0000-\u0008\u000B-\u001F\u007F]/g,'')
      );
    } catch (_) { /* try next model */ }
  }
  return null;
}

/* ════════════════════════════════════════
   YOUTUBE DATA API
════════════════════════════════════════ */
async function _ytSearch(query) {
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=1&q=${encodeURIComponent(query)}&relevanceLanguage=en&key=${encodeURIComponent(state.YT_KEY)}`;
  const res  = await fetch(url);
  if (!res.ok) throw new Error(`YouTube API ${res.status}`);
  const data = await res.json();
  const item = data.items?.[0];
  if (!item) return null;
  return {
    videoId  : item.id.videoId,
    title    : item.snippet.title,
    channel  : item.snippet.channelTitle,
    thumbnail: item.snippet.thumbnails?.medium?.url || item.snippet.thumbnails?.default?.url || '',
  };
}

/* ════════════════════════════════════════
   FETCH RESOURCES
════════════════════════════════════════ */
async function _fetchVideoResources(questionText, subject, level) {
  const cacheKey = `${level}::${subject}::${questionText.slice(0, 80)}`;
  if (_videoCache[cacheKey]) return _videoCache[cacheKey];

  const channels = _getChannels(subject, level);

  let topicData = null;
  try { topicData = await _fetchTopicData(questionText, subject, level); } catch (_) {}

  const topicLabel = topicData?.topicLabel || subject;
  const searches   = topicData?.searches?.length
    ? topicData.searches
    : [
        { query: `${questionText.slice(0, 60)} ${level}`,   angle: subject },
        { query: `${topicLabel} explained ${level} Nigeria`, angle: `${subject} — exam focus` },
      ];

  let videos = [];

  if (state.YT_KEY_VERIFIED && state.YT_KEY) {
    for (let i = 0; i < Math.min(2, searches.length); i++) {
      try {
        const result = await _ytSearch(searches[i].query);
        if (result) videos.push({
          mode    : 'embed',
          videoId : result.videoId,
          title   : result.title,
          channel : result.channel,
          angle   : searches[i].angle || '',
          thumb   : result.thumbnail,
          watchUrl: `https://www.youtube.com/watch?v=${result.videoId}`,
          embedUrl: `https://www.youtube.com/embed/${result.videoId}?rel=0&modestbranding=1`,
        });
      } catch (_) { /* skip */ }
    }
  }

  if (!videos.length) {
    videos = channels.slice(0, 4).map((ch, i) => {
      const si = i < searches.length ? i : 0;
      return {
        mode     : 'search',
        channel  : ch.name,
        handle   : ch.handle,
        angle    : (searches[si] || searches[0]).angle || '',
        searchUrl: `https://www.youtube.com/@${ch.handle}/search?query=${encodeURIComponent((searches[si] || searches[0]).query)}`,
        query    : (searches[si] || searches[0]).query,
      };
    });
  }

  const result = { topicLabel, videos, interactive: topicData?.interactive || null, manipulative: topicData?.manipulative || null };
  _videoCache[cacheKey] = result;
  return result;
}

/* ════════════════════════════════════════
   RENDER PANEL
════════════════════════════════════════ */
function _renderVideoPanel(row, data, isMath) {
  const esc = s => String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');

  const videoItems = (data.videos || []).map(v => {
    if (v.mode === 'embed') return `
      <div class="pvr-embed-block">
        <div class="pvr-embed-thumb-wrap" data-embedurl="${esc(v.embedUrl)}"
          tabindex="0" role="button" aria-label="Play ${esc(v.title)}">
          <img class="pvr-thumb" src="${esc(v.thumb)}" alt="${esc(v.title)}" loading="lazy">
          <div class="pvr-play-btn">▶</div>
        </div>
        <div class="pvr-embed-info">
          <div class="pvr-embed-title">${esc(v.title)}</div>
          <div class="pvr-embed-meta">
            <span class="pvr-embed-channel">${esc(v.channel)}</span>
            ${v.angle ? `<span class="pvr-embed-angle">${esc(v.angle)}</span>` : ''}
          </div>
          <a class="pvr-watch-link" href="${esc(v.watchUrl)}" target="_blank" rel="noopener noreferrer">Watch on YouTube ↗</a>
        </div>
      </div>`;
    return `
      <a class="pvr-search-card" href="${esc(v.searchUrl)}" target="_blank" rel="noopener noreferrer">
        <div class="pvr-search-yt-icon">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
        </div>
        <div class="pvr-search-info">
          <div class="pvr-search-channel">${esc(v.channel)}</div>
          <div class="pvr-search-query">${esc(v.angle || v.query)}</div>
          <div class="pvr-search-hint">Tap to search this channel on YouTube →</div>
        </div>
      </a>`;
  }).join('');

  let interactiveCards = '';
  if (isMath && Array.isArray(data.interactive) && data.interactive.length) {
    interactiveCards = `
      <div class="pvr-section-label">Interactive Practice</div>
      ${data.interactive.map(r => `
        <a class="pvr-tool-card" href="${esc(r.url)}" target="_blank" rel="noopener noreferrer">
          <div class="pvr-tool-type pvr-type-${esc(r.type)}">${esc(r.type)}</div>
          <div class="pvr-tool-info">
            <div class="pvr-tool-name">${esc(r.name)}</div>
            <div class="pvr-tool-desc">${esc(r.description)}</div>
          </div>
          <div class="pvr-ext-icon">↗</div>
        </a>`).join('')}
      ${data.manipulative ? `
        <div class="pvr-manipulative">
          <div class="pvr-manip-icon">✋</div>
          <div class="pvr-manip-text"><strong>Hands-on:</strong> ${esc(data.manipulative)}</div>
        </div>` : ''}`;
  }

  const modeLabel = data.videos?.[0]?.mode === 'embed'
    ? `<span class="pvr-mode-badge pvr-mode-live">▶ Live Videos</span>`
    : `<span class="pvr-mode-badge pvr-mode-search">🔍 Channel Search</span>`;

  row.innerHTML = `
    <div class="pvr-panel">
      <div class="pvr-header">
        <span class="pvr-topic">${esc(data.topicLabel || 'Resources')}</span>
        ${modeLabel}
        <button class="pvr-close-btn" type="button">✕</button>
      </div>
      <div class="pvr-section-label">Videos</div>
      ${videoItems}
      ${interactiveCards}
    </div>`;

  row.querySelectorAll('.pvr-embed-thumb-wrap').forEach(wrap => {
    const activate = () => {
      const iframe = document.createElement('div');
      iframe.className = 'pvr-iframe-wrap';
      iframe.innerHTML = `<iframe src="${wrap.dataset.embedurl}&autoplay=1"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen loading="lazy" frameborder="0"></iframe>`;
      wrap.replaceWith(iframe);
    };
    wrap.addEventListener('click', activate);
    wrap.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') activate(); });
  });

  row.querySelector('.pvr-close-btn').addEventListener('click', () => {
    row.innerHTML = `<button class="paper-video-btn" type="button">▶ Watch Video</button>`;
    row.querySelector('.paper-video-btn').addEventListener('click', () =>
      handleVideoBtn(row.querySelector('.paper-video-btn')));
  });
}

/* ── Public entry point ── */
export async function handleVideoBtn(btn) {
  const row = btn.closest('.paper-video-row');
  if (!row) return;
  const qTextEl      = row.closest('.paper-q-block')?.querySelector('.paper-q-text');
  const questionText = qTextEl?.textContent?.trim() || btn.dataset.qtext || '';
  const isMath       = _isMathSubject(state.st.subject);

  row.innerHTML = `<div class="pvr-loading"><span class="pvr-spinner"></span>${state.YT_KEY_VERIFIED ? 'Searching YouTube…' : 'Finding resources…'}</div>`;

  try {
    const data = await _fetchVideoResources(questionText, state.st.subject, state.st.cls);
    _renderVideoPanel(row, data, isMath);
  } catch (err) {
    row.innerHTML = `
      <div class="pvr-error">Could not load resources — ${err.message}.
        <button class="paper-video-btn pvr-retry-btn" type="button" style="margin-left:8px">Retry</button>
      </div>`;
    row.querySelector('.pvr-retry-btn').addEventListener('click', () => {
      row.innerHTML = `<button class="paper-video-btn" type="button">▶ Watch Video</button>`;
      const newBtn = row.querySelector('.paper-video-btn');
      if (questionText) newBtn.dataset.qtext = questionText;
      newBtn.addEventListener('click', () => handleVideoBtn(newBtn));
      handleVideoBtn(newBtn);
    });
  }
}
