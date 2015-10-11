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


_(Example is shortened for readability)_
