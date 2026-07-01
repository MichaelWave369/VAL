# VAL — Virtual Antikythera Ledger

**VAL** is a browser-based educational reconstruction of the Antikythera Mechanism as a transparent, claim-safe simulation.

It does not claim to be the preserved ancient machine in complete form. Instead, VAL separates what is being shown into clear layers:

- **Preserved / historically grounded**: major known cycle ideas such as Metonic and Saros-style calendar logic.
- **Inferred / reconstructed**: gear-train relationships and dial interpretations based on modern scholarship.
- **Educational approximation**: simplified astronomical calculations used so the simulation can run in the browser.
- **Speculative / future lane**: planet layers and advanced reconstructions not included in the default v0.3 mechanism.

## Live site

Once GitHub Pages finishes deploying, the site should be available at:

https://michaelwave369.github.io/VAL/

## What v0.3 includes

- Date/crank input
- Sun pointer and zodiac/calendar dial
- Moon pointer and Moon phase display
- Metonic 235-month cycle position
- Saros 223-month cycle position
- Exeligmos remainder display
- Educational eclipse-window check
- Gear x-ray visualization
- Claim ledger / receipt panel
- Source / confidence ledger
- Reference cards for grounded, inferred, approximate, and future lanes
- Model lane selector
- Copyable JSON receipts
- Downloadable JSON receipts
- MIT License

## Local use

This is a static site. Open `index.html` directly in a browser, or serve the folder with any local web server.

```bash
python -m http.server 8080
```

Then open:

```text
http://localhost:8080
```

## Claim boundary

VAL is an interpretive educational model. It uses modern cycle approximations to make the ancient idea playable and inspectable. It should not be used as a precision astronomy tool, a complete scholarly reconstruction, or a claim that all missing Antikythera components are known with certainty.

## v0.3 model lanes

| Lane | Use | Claim boundary |
| --- | --- | --- |
| Conservative teaching model | Strongest public layer: Sun/Moon pointers, Moon phase, Metonic, Saros, Exeligmos, and receipts. | No exact preserved gear layout or precision astronomy claim. |
| Cycle-forward reconstruction | Emphasizes how grounded cycle ideas can be interpreted as dial behavior. | Does not claim the SVG spirals or CSS gears are the final ancient arrangement. |
| Cosmos preview / locked lane | Documents the future planet/cosmos direction. | Does not activate planet outputs or claim planetary reconstruction certainty. |

## v0.3 confidence lanes

| Lane | Use |
| --- | --- |
| Grounded | Cycle-level history, including Metonic and Saros framing. |
| Inferred | Reconstructed layouts, missing components, and gear relationships. |
| Approx | Browser math, SVG spirals, CSS gears, and simplified eclipse-window checks. |
| Future | Planet pointers, alternate cosmos models, and per-source reconstruction toggles. |

## License

VAL is released under the MIT License. See `LICENSE`.

## Project direction

Future versions can add:

- Full 3D gear view
- Configurable reconstruction models
- Source-cited scholarship cards with page/section notes
- Planetary pointer layer marked by confidence level
- Import/export simulation receipt history
- Test fixtures comparing model output against known dates
