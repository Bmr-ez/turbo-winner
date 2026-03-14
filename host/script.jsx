/**
 * Gemini AE Assistant Host Script
 * This script runs in the After Effects ExtendScript engine.
 */

function testConnection() {
    return "After Effects is successfully connected to Gemini!";
}

function getProjectInfo() {
    var proj = app.project;
    var info = {
        name: proj.file ? proj.file.name : "Unsaved Project",
        comps: proj.numItems,
        fps: 24
    };
    return JSON.stringify(info);
}

// You can add more complex helper functions here that the AI can call easily.
// For example:
function createStandardComp(name) {
    return app.project.items.addComp(name, 1920, 1080, 1.0, 10, 24);
}
