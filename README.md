[![Circle CI](https://circleci.com/gh/darvin/enwiktionary-analyzer.svg?style=shield)](https://circleci.com/gh/darvin/enwiktionary-analyzer)
[![codecov.io](http://codecov.io/github/darvin/enwiktionary-analyzer/coverage.svg?branch=master)](http://codecov.io/github/darvin/enwiktionary-analyzer?branch=master)
[![npm version](https://badge.fury.io/js/enwiktionary-analyzer.svg)](https://badge.fury.io/js/enwiktionary-analyzer)
[![Code Climate](https://codeclimate.com/github/darvin/enwiktionary-analyzer/badges/gpa.svg)](https://codeclimate.com/github/darvin/enwiktionary-analyzer)
![Dependencies](https://david-dm.org/darvin/enwiktionary-analyzer.svg)

# Wiktionary Analyzer

Analyzes English Wiktionary

## Usage

```javascript
var wiktAnalyzer = require('enwiktionary-analyzer');
var articleName = "test";
wiktAnalyzer.api.fetchArticle(articleName, function(err, article) {
    wiktAnalyzer.analyzer.parseArticle(articleName, article, function(err, result) {
        var englishArticle = article.en;
        console.log(englishArticle);
    });
});
```

That would output:

<!--- begin example -->

```javascript
{
  "word": [
    "en",
    "test"
  ],
  "pronunciations": [
    {
      "pronunciation": "/tɛst/"
    },
    {
      "audioFile": "en-us-test.ogg",
      "audioDescription": "Audio (US)"
    },
    {
      "audioFile": "En-uk-a test.ogg",
      "audioDescription": "Audio (UK)"
    },
    {
      "accent": "South African",
      "pronunciation": "/test/"
    }
  ],
  "rhymes": [
    {
      "rhyme": "ɛst"
    }
  ],
  "meanings": [
    {
      "etymology": {
        "from": [
          [
            "fro",
            "test"
          ],
          [
            "la",
            "testum"
          ],
          [
            "la",
            "*terstus"
          ],
          [
            "la",
            "terra"
          ],
          [
            "la",
            "*tersa"
          ]
        ]
      },
      "roles": [
        {
          "role": "noun",
          "explanations": [
            {
              "explanation": " A {{%%wl%%}} or cupelling hearth in which precious metals are melted for trial and refinement.",
              "mentionedWords": [
                [
                  "en",
                  "cupel"
                ]
              ]
            },
            {
              "explanation": " A {{%%wl%%}}, {{%%wl%%}}.\n",
              "mentionedWords": [
                [
                  null,
                  "challenge"
                ],
                [
                  "en",
                  "trial"
                ]
              ],
              "usages": [
                {
                  "usage": " Colin Allen2American ScientistMarch-April168Numerous experimental tests and other observations have been offered in favor of animal mind reading, and although many scientists are skeptical, others assert that humans are not the only species capable of representing what others do and don’t perceive and know.Do I See What You See?http://www.americanscientist.org/bookshelf/pub/do-i-see-what-you-see1002012"
                }
              ]
            },
            {
              "explanation": "  An {{%%wl%%}}, given often during the academic {{%%wl%%}}.",
              "mentionedWords": [
                [
                  "en",
                  "examination"
                ],
                [
                  "en",
                  "term"
                ]
              ],
              "context": "academia"
            },
            {
              "explanation": " A {{%%wl%%}} in which a product or piece of equipment is {{%%wl%%}} under everyday or extreme conditions to {{%%wl%%}} its {{%%wl%%}}, etc.",
              "mentionedWords": [
                [
                  "en",
                  "session"
                ],
                [
                  "en",
                  "examined"
                ],
                [
                  "en",
                  "evaluate"
                ],
                [
                  "en",
                  "durability"
                ]
              ]
            },
            {
              "explanation": "  A {{%%wl%%}}.",
              "mentionedWords": [
                [
                  "en",
                  "Test match"
                ]
              ],
              "context": "cricket"
            },
            {
              "explanation": "  The external {{%%wl%%}} shell, or {{%%wl%%}}, of an {{%%wl%%}}, e.g. {{%%wl%%}} and {{%%wl%%}}.",
              "mentionedWords": [
                [
                  "en",
                  "calciferous"
                ],
                [
                  "en",
                  "endoskeleton"
                ],
                [
                  "en",
                  "echinoderm"
                ],
                [
                  "en",
                  "sand dollars"
                ],
                [
                  "en",
                  "sea urchins"
                ]
              ],
              "context": "marine biology"
            },
            {
              "explanation": "  {{%%wl%%}}; {{%%wl%%}}.",
              "mentionedWords": [
                [
                  "en",
                  "Testa"
                ],
                [
                  "en",
                  "seed coat"
                ]
              ],
              "context": "botany"
            },
            {
              "explanation": "  Judgment; distinction; discrimination.\n",
              "usages": [
                {
                  "usage": " Dryden\n Who would excel, when few can make a test / Betwixt indifferent writing and the best?"
                }
              ]
            }
          ],
          "synonyms": [
            [
              "en",
              "challenge"
            ],
            [
              "en",
              "trial"
            ],
            [
              "en",
              "quiz"
            ],
            [
              "en",
              "examination"
            ]
          ],
          "antonyms": [
            [
              "en",
              "breeze"
            ],
            [
              "en",
              "recess"
            ]
          ],
          "hyponyms": [
            [
              "en",
              "acid test"
            ],
            [
              "en",
              "Rorschach test"
            ],
            [
              "en",
              "single-choice test"
            ],
            [
              "en",
              "smell test"
            ],
            [
              "en",
              "smoke test"
            ],
            [
              "en",
              "sniff test"
            ],
            [
              "en",
              "stress test"
            ],
            [
              "en",
              "babysitter test"
            ],
            [
              "en",
              "blood test"
            ],
            [
              "en",
              "duck test"
            ],
            [
              "en",
              "flame test"
            ],
            [
              "en",
              "inkblot test"
            ],
            [
              "en",
              "litmus test"
            ],
            [
              "en",
              "multiple-choice test"
            ],
            [
              "en",
              "nose test"
            ]
          ],
          "derivedTerms": [
            [
              "en",
              "tester"
            ]
          ],
          "relatedTerms": [
            [
              "en",
              "test case"
            ],
            [
              "en",
              "test drive"
            ],
            [
              "en",
              "test flight"
            ],
            [
              "en",
              "test run"
            ],
            [
              "en",
              "test tube"
            ]
          ],
          "descendants": [
            [
              "de",
              "Test"
            ],
            [
              "de",
              "test"
            ]
          ],
          "translations": [
            [
              "sq",
              "provë"
            ],
            [
              "sq",
              "prova"
            ],
            [
              "ar",
              "اِخْتِبَار"
            ],
            [
              "ast",
              "prueba"
            ],
            [
              "cmn",
              "試驗"
            ],
            [
              "cmn",
              "试验"
            ],
            [
              "cs",
              "test"
            ],
            [
              "cs",
              "zkouška"
            ],
            [
              "nl",
              "test"
            ],
            [
              "nl",
              "proef"
            ],
            [
              "fi",
              "koe"
            ],
            [
              "fi",
              "koetus"
            ],
            [
              "fr",
              "épreuve"
            ],
            [
              "fur",
              "prove"
            ],
            [
              "de",
              "Probe"
            ],
            [
              "el",
              "δοκιμασία"
            ],
            [
              "el",
              "δοκιμή"
            ],
            [
              "he",
              "מבחן"
            ],
            [
              "hi",
              "चुनौती"
            ],
            [
              "hu",
              "próba"
            ],
            [
              "it",
              "prova"
            ],
            [
              "it",
              "verifica"
            ],
            [
              "ja",
              "実験"
            ],
            [
              "ja",
              "試練"
            ],
            [
              "ko",
              "검사"
            ],
            [
              "lld",
              "proa"
            ],
            [
              "lb",
              "Prouf"
            ],
            [
              "fa",
              "آزمایش"
            ],
            [
              "pt",
              "prova"
            ],
            [
              "pt",
              "teste"
            ],
            [
              "ro",
              "probă"
            ],
            [
              "ru",
              "про́ба"
            ],
            [
              "ru",
              "тест"
            ],
            [
              "ru",
              "испыта́ние"
            ],
            [
              "sc",
              "proa"
            ],
            [
              "sc",
              "proba"
            ],
            [
              "sc",
              "prova"
            ],
            [
              "gd",
              "dearbhadh"
            ],
            [
              "gd",
              "feuchainn"
            ],
            [
              "sh",
              "тест"
            ],
            [
              "sh",
              "test"
            ],
            [
              "scn",
              "prova"
            ],
            [
              "sl",
              "preizkus"
            ],
            [
              "sl",
              "preizkušnja"
            ],
            [
              "es",
              "prueba"
            ],
            [
              "sw",
              "jaribio"
            ],
            [
              "sv",
              "prov"
            ],
            [
              "sv",
              "prövning"
            ],
            [
              "tr",
              "test"
            ],
            [
              "tr",
              "deneme"
            ],
            [
              "vec",
              "prova"
            ],
            [
              "zza",
              "cerbnayen"
            ],
            [
              "zza",
              "test kerden"
            ],
            [
              "sq",
              "provim"
            ],
            [
              "sq",
              "provimi"
            ],
            [
              "ar",
              "اِمْتِحَان"
            ],
            [
              "ar",
              "اِخْتِبَار"
            ],
            [
              "cmn",
              "考試"
            ],
            [
              "cmn",
              "考试"
            ],
            [
              "cs",
              "zkouška"
            ],
            [
              "nl",
              "examen"
            ],
            [
              "nl",
              "test"
            ],
            [
              "eo",
              "ekzameno"
            ],
            [
              "fi",
              "koe"
            ],
            [
              "fi",
              "tentti"
            ],
            [
              "fr",
              "test"
            ],
            [
              "fr",
              "examen"
            ],
            [
              "de",
              "Examen"
            ],
            [
              "de",
              "Prüfung"
            ],
            [
              "el",
              "διαγώνισμα"
            ],
            [
              "he",
              "מבחן"
            ],
            [
              "hi",
              "परीक्षा"
            ],
            [
              "hu",
              "vizsga"
            ],
            [
              "ga",
              "scrúdú"
            ],
            [
              "it",
              "esame"
            ],
            [
              "ja",
              "試験"
            ],
            [
              "ja",
              "テスト"
            ],
            [
              "ko",
              "시험"
            ],
            [
              "ko",
              "試驗"
            ],
            [
              "ko",
              "테스트"
            ],
            [
              "ckb",
              "تاقیکردنه‌وه‌"
            ],
            [
              "ms",
              "ujian"
            ],
            [
              "fa",
              "آزمایش"
            ],
            [
              "fa",
              "تست"
            ],
            [
              "pl",
              "sprawdzian"
            ],
            [
              "pt",
              "exame"
            ],
            [
              "pt",
              "teste"
            ],
            [
              "ro",
              "examen"
            ],
            [
              "ru",
              "экза́мен"
            ],
            [
              "ru",
              "тест"
            ],
            [
              "ru",
              "контро́льная рабо́та"
            ],
            [
              "gd",
              "feuchainn"
            ],
            [
              "sh",
              "тест"
            ],
            [
              "sh",
              "test"
            ],
            [
              "scn",
              "esami"
            ],
            [
              "sl",
              "test"
            ],
            [
              "es",
              "examen"
            ],
            [
              "es",
              "test"
            ],
            [
              "sw",
              "jaribio"
            ],
            [
              "sv",
              "prov"
            ],
            [
              "sv",
              "tentamen"
            ],
            [
              "sv",
              "tenta"
            ],
            [
              "sv",
              "dugga"
            ],
            [
              "tl",
              "pagsusulit"
            ],
            [
              "te",
              "పరీక్ష"
            ],
            [
              "th",
              "สอบ"
            ],
            [
              "tr",
              "sınav"
            ],
            [
              "tr",
              "test"
            ],
            [
              "vi",
              "thi"
            ],
            [
              "vi",
              "kiểm tra"
            ],
            [
              "cmn",
              "測試"
            ],
            [
              "cmn",
              "测试"
            ],
            [
              "cmn",
              "檢查"
            ],
            [
              "cmn",
              "检查"
            ],
            [
              "cs",
              "test"
            ],
            [
              "nl",
              "test"
            ],
            [
              "fi",
              "testi"
            ],
            [
              "fi",
              "käyttökoe"
            ],
            [
              "fr",
              "test"
            ],
            [
              "de",
              "Test"
            ],
            [
              "de",
              "Prüfung"
            ],
            [
              "el",
              "εξέταση"
            ],
            [
              "hu",
              "teszt"
            ],
            [
              "hu",
              "vizsgálat"
            ],
            [
              "ga",
              "tástáil"
            ],
            [
              "ja",
              "検査"
            ],
            [
              "ja",
              "テスト"
            ],
            [
              "ko",
              "테스트"
            ],
            [
              "ms",
              "ujian"
            ],
            [
              "pl",
              "sprawdzian"
            ],
            [
              "pl",
              "test"
            ],
            [
              "pt",
              "teste"
            ],
            [
              "ro",
              "probă"
            ],
            [
              "ro",
              "test"
            ],
            [
              "ru",
              "тест"
            ],
            [
              "ru",
              "испыта́ние"
            ],
            [
              "gd",
              "dearbhadh"
            ],
            [
              "gd",
              "feuchainn"
            ],
            [
              "sh",
              "тест"
            ],
            [
              "sh",
              "test"
            ],
            [
              "sl",
              "test"
            ],
            [
              "es",
              "prueba"
            ],
            [
              "es",
              "test"
            ],
            [
              "sw",
              "jaribio"
            ],
            [
              "sv",
              "test"
            ],
            [
              "sv",
              "provning"
            ],
            [
              "sv",
              "prov"
            ],
            [
              "te",
              "పరీక్ష"
            ],
            [
              "sw",
              "jaribio"
            ],
            [
              "sw",
              "majaribio"
            ],
            [
              "fi",
              "kuori"
            ],
            [
              "sw",
              "majaribio"
            ]
          ]
        },
        {
          "role": "verb",
          "explanations": [
            {
              "explanation": " To {{%%wl%%}} (gold, silver, etc.) in a {{%%wl%%}} or {{%%wl%%}}; to subject to {{%%wl%%}}.",
              "mentionedWords": [
                [
                  "en",
                  "refine"
                ],
                [
                  "en",
                  "test"
                ],
                [
                  "en",
                  "cupel"
                ],
                [
                  "en",
                  "cupellation"
                ]
              ]
            },
            {
              "explanation": " To {{%%wl%%}}.\n",
              "mentionedWords": [
                [
                  null,
                  "challenge"
                ]
              ],
              "usages": [
                {
                  "usage": " Climbing the mountain tested our stamina."
                }
              ]
            },
            {
              "explanation": " To put to the proof; to prove the truth, genuineness, or quality of by experiment, or by some principle or standard; to try.\n",
              "usages": [
                {
                  "usage": " to test the soundness of a principle; to test the validity of an argument"
                },
                {
                  "usage": " Washington\n Experience is the surest standard by which to test the real tendency of the existing constitution."
                }
              ]
            },
            {
              "explanation": "  To administer or assign an examination, often given during the academic term, to (somebody).",
              "context": "academics"
            },
            {
              "explanation": " To place a product or piece of equipment under everyday and/or extreme conditions and examine it for its durability, etc.\n",
              "usages": [
                {
                  "usage": " Charles T. Ambrose3American ScientistMay-June200Similar studies of rats have employed four different intracranial resorbable, slow sustained release systems— […]. Such a slow-release device containing angiogenic factors could be placed on the pia mater covering the cerebral cortex and tested in persons with senile dementia in long term studies.Alzheimer’s Disease1012013"
                }
              ]
            },
            {
              "explanation": "  To be shown to be by test.\n",
              "context": "copulative",
              "usages": [
                {
                  "usage": " He tested positive for cancer.en"
                }
              ]
            },
            {
              "explanation": "  To examine or try, as by the use of some {{%%wl%%}}.\n",
              "mentionedWords": [
                [
                  "en",
                  "reagent"
                ]
              ],
              "context": "chemistry",
              "usages": [
                {
                  "usage": " to test a solution by litmus paper"
                }
              ]
            }
          ],
          "descendants": [
            [
              "de",
              "testen"
            ]
          ],
          "translations": [
            [
              "fi",
              "testata"
            ],
            [
              "fi",
              "koestaa"
            ],
            [
              "fi",
              "haastaa"
            ],
            [
              "fr",
              "tester"
            ],
            [
              "fr",
              "mettre à l'épreuve"
            ],
            [
              "el",
              "δοκιμάζω"
            ],
            [
              "hu",
              "kihív"
            ],
            [
              "it",
              "testare"
            ],
            [
              "ja",
              "試す"
            ],
            [
              "pt",
              "testar"
            ],
            [
              "ru",
              "испы́тывать"
            ],
            [
              "ru",
              "испыта́ть"
            ],
            [
              "ru",
              "тести́ровать"
            ],
            [
              "ru",
              "протести́ровать"
            ],
            [
              "gd",
              "feuch"
            ],
            [
              "sl",
              "preizkusiti"
            ],
            [
              "es",
              "probar"
            ],
            [
              "es",
              "testear"
            ],
            [
              "sw",
              "majaribio"
            ],
            [
              "fi",
              "järjestää"
            ],
            [
              "fi",
              "tentti"
            ],
            [
              "fr",
              "tester"
            ],
            [
              "el",
              "εξετάζω"
            ],
            [
              "hu",
              "vizsgázik"
            ],
            [
              "hu",
              "vizsgáztat"
            ],
            [
              "ja",
              "テストする"
            ],
            [
              "la",
              "specto"
            ],
            [
              "ru",
              "тести́ровать"
            ],
            [
              "ru",
              "протести́ровать"
            ],
            [
              "gd",
              "feuch"
            ],
            [
              "sw",
              "majaribio"
            ],
            [
              "ca",
              "provar"
            ],
            [
              "cs",
              "testovat"
            ],
            [
              "fi",
              "testata"
            ],
            [
              "fr",
              "tester"
            ],
            [
              "el",
              "δοκιμάζω"
            ],
            [
              "el",
              "θέτω υπό δοκιμασία"
            ],
            [
              "hu",
              "tesztel"
            ],
            [
              "hu",
              "vizsgál"
            ],
            [
              "ga",
              "tástáil"
            ],
            [
              "it",
              "testare"
            ],
            [
              "pt",
              "testar"
            ],
            [
              "ru",
              "тести́ровать"
            ],
            [
              "ru",
              "протести́ровать"
            ],
            [
              "sl",
              "testirati"
            ],
            [
              "sl",
              "preizkusiti"
            ],
            [
              "es",
              "examinar"
            ],
            [
              "es",
              "probar"
            ],
            [
              "es",
              "testear"
            ],
            [
              "sw",
              "majaribio"
            ],
            [
              "fi",
              "testata"
            ],
            [
              "sw",
              "majaribio"
            ]
          ]
        }
      ]
    },
    {
      "etymology": {
        "from": [
          [
            "fro",
            "tester"
          ],
          [
            "la",
            "testari"
          ],
          [
            "la",
            "testis"
          ]
        ]
      },
      "roles": [
        {
          "role": "noun",
          "explanations": [
            {
              "explanation": "  A {{%%wl%%}}.\n",
              "mentionedWords": [
                [
                  "en",
                  "witness"
                ]
              ],
              "context": "obsolete",
              "usages": [
                {
                  "usage": " Ld. Berners\n Prelates and great lords of England, who were for the more surety tests of that deed."
                }
              ]
            }
          ]
        },
        {
          "role": "verb",
          "explanations": [
            {
              "explanation": "  To make a {{%%wl%%}}, or {{%%wl%%}}.",
              "mentionedWords": [
                [
                  "en",
                  "testament"
                ],
                [
                  "en",
                  "will"
                ]
              ],
              "context": "obsolete"
            }
          ],
          "relatedTerms": [
            [
              "en",
              "attest"
            ],
            [
              "en",
              "contest"
            ],
            [
              "en",
              "detest"
            ],
            [
              "en",
              "protest"
            ]
          ]
        }
      ]
    }
  ],
  "anagrams": [
    [
      "en",
      "sett"
    ],
    [
      "en",
      "stet"
    ]
  ]
}
```
<!--- end example -->

