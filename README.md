# VAL — Virtual Antikythera Ledger

**VAL** is a browser-based educational reconstruction of the Antikythera Mechanism as a transparent, claim-safe simulation.

It does not claim to be the preserved ancient machine in complete form. Instead, VAL separates what is being shown into clear layers:

- **Preserved / historically grounded**: major known cycle ideas such as Metonic and Saros-style calendar logic.
- **Inferred / reconstructed**: gear-train relationships and dial interpretations based on modern scholarship.
- **Educational approximation**: simplified astronomical calculations used so the simulation can run in the browser.
- **Speculative / future lane**: planet layers and advanced reconstructions not included in v0.

## Live site

Once GitHub Pages finishes deploying, the site should be available at:

https://michaelwave369.github.io/VAL/

## What v0 includes

- Date/crank input
- Sun pointer and zodiac/calendar dial
- Moon pointer and Moon phase display
- Metonic 235-month cycle position
- Saros 223-month cycle position
- Exeligmos remainder display
- Educational eclipse-window check
- Gear x-ray visualization
- Claim ledger / receipt panel

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

## Project direction

Future versions can add:

- Full 3D gear view
- Configurable reconstruction models
- Source-cited scholarship cards
- Planetary pointer layer marked by confidence level
- Import/export simulation receipts
- Test fixtures comparing model output against known dates
