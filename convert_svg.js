const fs = require('fs');

try {
    let svg = fs.readFileSync('svg/in.svg', 'utf-8');

    // Clean up XML declaration and comments
    svg = svg.replace(/<\?xml.*?\?>/, '');
    svg = svg.replace(/<!--[\s\S]*?-->/g, '');

    // Replace invalid JSX attributes
    svg = svg.replace(/viewbox/gi, 'viewBox');
    svg = svg.replace(/stroke-width/gi, 'strokeWidth');
    svg = svg.replace(/stroke-linecap/gi, 'strokeLinecap');
    svg = svg.replace(/stroke-linejoin/gi, 'strokeLinejoin');
    svg = svg.replace(/baseprofile/gi, 'baseProfile');
    svg = svg.replace(/class=/gi, 'className=');

    // Remove hardcoded fills and strokes so we can control via CSS
    svg = svg.replace(/fill="[^"]*"/gi, '');
    svg = svg.replace(/stroke="[^"]*"/gi, '');

    // Add CSS classes and events to states/districts
    svg = svg.replace(/<(path|circle)([^>]+)name="([^"]+)"([^>]*)>/gi, (match, tag, before, name, after) => {
        // Strip trailing slash if present safely
        let isSelfClosing = after.trim().endsWith('/');
        let cleanAfter = after;
        if (isSelfClosing) {
            cleanAfter = after.trim().slice(0, -1).trim();
        }

        let output = `<${tag}${before}name="${name}" ${cleanAfter}
            className={\`state-region \${manufacturingStates.includes('${name}') ? 'state-manufacturing' : 'state-disabled'} \${selectedRegion === '${name}' ? 'state-active' : ''}\`}
            onClick={(e) => { e.stopPropagation(); onRegionSelect('${name}'); }}
            onMouseEnter={(e) => onRegionHover('${name}', e)}
            onMouseLeave={onRegionLeave}
        >`;

        if (isSelfClosing) {
            output += `</${tag}>`;
        }
        return output;
    });

    // Our regex left the opening tag just as `<path ...>`, meaning they are NOT self-closing.
    // The original SVGs had `</path>` and `</circle>` following. This is perfectly fine in JSX.

    // Remove any remaining self-closing slashes that might cause issues due to regex above adding </tag>
    svg = svg.replace(/<([^>]+)\/>/gi, '<$1></$1>'); // Fallback for any other self closing tags if they exist. (We don't need this if we handle them correctly above).

    // Wrap in a React Component
    const component = `
import React from 'react';

const manufacturingStates = [
  'Tamil Nadu', 'Karnataka', 'Andhra Pradesh', 'Maharashtra'
];

const IndiaDetailedMapSvg = ({ onRegionSelect, onRegionHover, onRegionLeave, selectedRegion, children }) => {
    return (
        <div className="india-svg-container">
            <svg baseProfile="tiny" height="1000" strokeLinecap="round" strokeLinejoin="round" strokeWidth=".5" version="1.2" viewBox="0 0 1000 1000" width="1000" xmlns="http://www.w3.org/2000/svg">
                ${svg.replace(/<svg[^>]*>|<\/svg>/gi, '').trim()}
                <g id="custom-hubs">
                    {children}
                </g>
            </svg>
        </div>
    );
};

export default IndiaDetailedMapSvg;
`;

    fs.writeFileSync('components/IndiaDetailedMapSvg.js', component);
    console.log("Transformation successful!");
} catch (e) {
    console.error("Error transforming SVG: ", e);
}
