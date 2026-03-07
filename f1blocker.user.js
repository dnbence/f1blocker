// ==UserScript==
// @name         F1 spoiler blocker
// @version      2.0
// @description  Formula 1 related news blocker
// @author       Bence Gacsályi
// @match        https://telex.hu/
// @grant        none
// ==/UserScript==

(function() {
	'use strict';

	const settings = {
		hideBeforeDays: 4,
		hideAfterDays: 3,
	};

	const patterns = [
		/f(orma|ormula)?[ \-]?1/i,
		/nagydíj/i,
		/időmérő/i,
		/szabadedzés/i,
		/futam/i,
		/pilóta/i,
		/versenyző/i,
		/boxutca/i,
		/pole/i,
		/rajtrács/i,
		/világbajnokság/i,
		/konstruktőr/i,
		/motorhiba/i,
		// /csapat/i,
		// /fia/i,

		/ferrari/i,
		/mercedes/i,
		/red bull/i,
		/racing bulls/i,
		/mclaren/i,
		/alpine/i,
		/aston martin/i,
		/williams/i,
		/haas/i,
		/sauber/i,
		/audi/i,
		/cadillac/i,

		/lindblad/i,
		/bearman/i,
		/doohan/i,
		/lawson/i,
		/hadjar/i,
		/antonelli/i,
		/bortoleto/i,
		/colapinto/i,
		/verstappen/i,
		/p(e|é)rez/i,
		/hamilton/i,
		/russell/i,
		/leclerc/i,
		/sainz/i,
		/norris/i,
		/piastri/i,
		/alonso/i,
		/stroll/i,
		/gasly/i,
		/ocon/i,
		/albon/i,
		/sargeant/i,
		/bottas/i,
		/zhou/i,
		/magnussen/i,
		/h(ü|u)lkenberg/i,
		/ricciardo/i,
		/tsunoda/i,
		
		/bahrein/i,
		/dzsiddah/i,
		/melbourne/i,
		/szuzuka/i,
		/sanghaj/i,
		/miami/i,
		/imola/i,
		/monaco/i,
		/barcelona/i,
		/montreál/i,
		/spielberg/i,
		/silverstone/i,
		/hungaroring/i,
		/spa/i,
		/zandvoort/i,
		/monza/i,
		/baku/i,
		/szingapúr/i,
		/austin/i,
		/mexikóváros/i,
		/interlagos/i,
		/las vegas/i,
		/qatar/i,
		/abu dhabi/i,
	];

	const races = [
		"2026-03-08", // Bahrain GP
		"2026-03-15", // Saudi Arabian GP (Jeddah)
		"2026-03-22", // Australian GP (Melbourne)
		"2026-04-05", // Japanese GP (Suzuka)
		"2026-04-19", // Chinese GP (Shanghai)
		"2026-05-03", // Miami GP
		"2026-05-17", // Emilia-Romagna GP (Imola)
		"2026-05-24", // Monaco GP
		"2026-06-07", // Spanish GP (Barcelona)
		"2026-06-14", // Canadian GP (Montreal)
		"2026-06-28", // Austrian GP (Spielberg)
		"2026-07-12", // British GP (Silverstone)
		"2026-07-26", // Hungarian GP (Hungaroring)
		"2026-08-02", // Belgian GP (Spa)
		"2026-08-23", // Dutch GP (Zandvoort)
		"2026-09-06", // Italian GP (Monza)
		"2026-09-20", // Azerbaijan GP (Baku)
		"2026-09-27", // Singapore GP
		"2026-10-11", // United States GP (Austin)
		"2026-10-25", // Mexico City GP
		"2026-11-08", // São Paulo GP (Interlagos)
		"2026-11-22", // Las Vegas GP
		"2026-11-29", // Qatar GP
		"2026-12-06"  // Abu Dhabi GP
	];

	const sites = {
		'telex.hu': {
			selectors: '.item__title, .item__lead',
			hide: function(el) {
				let node = el;
				while (node && node !== document) {
					if (node.classList && node.classList.contains('item__content')) {
						node.classList.add('f1-blocked-telex');
						// Add click event to show again
						node.addEventListener('click', function handler(e) {
							node.classList.remove('f1-blocked-telex');
							node.removeEventListener('click', handler);
							e.stopPropagation();
						});
						break;
					}
					node = node.parentNode;
				}
			},
			show: function(el) {
				el.classList.remove('f1-blocked-telex');
			}
		}
	};

	const style = `
		.f1-blocked-telex {
			position: relative;
		}
		.f1-blocked-telex::before {
			position: absolute;
			content: '';
			width: 100%;
			height: 100%;
			left: 0;
			top: 0;
			background: purple;
			z-index: 9;
		}
		.f1-blocked-telex::after {
			position: absolute;
			content: 'F1 hír blokkolva';
			width: 100%;
			height: 100%;
			left: 0;
			top: 0;
			z-index: 99;
			color: white;
			display: flex;
			align-items: center;
			justify-content: center;
			cursor: pointer;
		}
	`;


	// Check if dates are between race date window
	const today = new Date();
	const hideBefore = settings.hideBeforeDays * 24 * 60 * 60 * 1000;
	const hideAfter = settings.hideAfterDays * 24 * 60 * 60 * 1000;
	const raceDates = races.map(d => new Date(d));
	let inBlockWindow = false;
	for (let i = 0; i < raceDates.length; i++) {
		const start = new Date(raceDates[i].getTime() - hideBefore);
		const end = new Date(raceDates[i].getTime() + hideAfter);
		if (today >= start && today <= end) {
			inBlockWindow = true;
			break;
		}
	}
	if (!inBlockWindow) return;

	// Inject CSS to hide blocked items
	const styleEl = document.createElement('style');
	styleEl.textContent = style;
	document.head.appendChild(styleEl);

	const siteHostname = window.location.hostname;
	const siteSettings = sites[siteHostname];

	// Loop through .item__title elements
	document.querySelectorAll(siteSettings.selectors).forEach(function(titleEl) {
		const text = titleEl.textContent.trim();

		if (patterns.some(pattern => pattern.test(text))) {
			siteSettings?.hide(titleEl);
		}
	});
})();