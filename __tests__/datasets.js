"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dataset1 = exports.video1 = void 0;
// готовые данные для переиспользования в тестах
exports.video1 /*VideoDBType*/ = {
    id: Date.now() + Math.random(),
    title: 't' + Date.now() + Math.random(),
    // author: 'a' + Date.now() + Math.random(),
    // canBeDownloaded: true,
    // minAgeRestriction: null,
    // createdAt: new Date().toISOString(),
    // publicationDate: new Date().toISOString(),
    // availableResolution: [Resolutions.P240],
};
// ...
exports.dataset1 = {
    videos: [exports.video1],
};
// ...
