import test from '@interactjs/_dev/test/test';
import Signals from '@interactjs/utils/Signals';
import Interaction from './Interaction';
import interactions from './interactions';
import * as helpers from './tests/_helpers';
test('interactions', t => {
    let scope = helpers.mockScope();
    const interaction = scope.interactions.new({ pointerType: 'TEST' });
    t.equal(scope.interactions.list[0], interaction, 'new Interaction is pushed to scope.interactions');
    t.ok(scope.interactions instanceof Object, 'interactions object added to scope');
    const listeners = scope.interactions.listeners;
    t.ok(interactions.methodNames.reduce((acc, m) => acc && typeof listeners[m] === 'function', true), 'interactions object added to scope');
    scope = helpers.mockScope();
    const newInteraction = scope.interactions.new({});
    t.assert(typeof scope.interactions === 'object');
    t.assert(scope.interactions.signals instanceof Signals);
    t.assert(typeof scope.interactions.new === 'function');
    t.assert(newInteraction instanceof Interaction);
    t.equal(newInteraction._signals, scope.interactions.signals);
    t.assert(typeof scope.actions === 'object');
    t.deepEqual(scope.actions.names, []);
    t.deepEqual(scope.actions.methodDict, {});
    t.end();
});
test('interactions document event options', t => {
    const scope = helpers.mockScope();
    const doc = scope.document;
    let options = {};
    scope.browser = { isIOS: false };
    scope.signals.fire('add-document', { doc, scope, options });
    t.deepEqual(options, {}, 'no doc options.event.passive is added when not iOS');
    options = {};
    scope.browser.isIOS = true;
    scope.signals.fire('add-document', { doc, scope, options });
    t.deepEqual(options, { events: { passive: false } }, 'doc options.event.passive is set to false for iOS');
    t.end();
});
test('interactions removes pointers on targeting removed elements', t => {
    const { interaction, scope, } = helpers.testEnv();
    const { TouchEvent, Touch = function (_t) { return _t; } } = scope.window;
    const div1 = scope.document.body.appendChild(scope.document.createElement('div'));
    const div2 = scope.document.body.appendChild(scope.document.createElement('div'));
    const touch1Init = { bubbles: true, changedTouches: [new Touch({ identifier: 1, target: div1 })] };
    const touch2Init = { bubbles: true, changedTouches: [new Touch({ identifier: 2, target: div2 })] };
    interaction.pointerType = 'touch';
    div1.dispatchEvent(new TouchEvent('touchstart', touch1Init));
    div1.dispatchEvent(new TouchEvent('touchmove', touch1Init));
    t.equal(scope.interactions.list.length, 1);
    t.equal(interaction.pointers.length, 1, 'down pointer added to interaction');
    t.equal(interaction._latestPointer.eventTarget, div1, '_latestPointer target is down target');
    div1.remove();
    div2.dispatchEvent(new TouchEvent('touchstart', touch2Init));
    t.deepEqual(scope.interactions.list, [interaction], 'interaction with removed element is reused for new pointer');
    t.equal(interaction.pointers.length, 1, 'pointer on removed element is removed from existing interaction and new pointerdown is added');
    t.end();
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZXJhY3Rpb25zLnNwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbnRlcmFjdGlvbnMuc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLElBQUksTUFBTSw0QkFBNEIsQ0FBQTtBQUM3QyxPQUFPLE9BQU8sTUFBTSwyQkFBMkIsQ0FBQTtBQUMvQyxPQUFPLFdBQVcsTUFBTSxlQUFlLENBQUE7QUFDdkMsT0FBTyxZQUFZLE1BQU0sZ0JBQWdCLENBQUE7QUFDekMsT0FBTyxLQUFLLE9BQU8sTUFBTSxrQkFBa0IsQ0FBQTtBQUUzQyxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUMsQ0FBQyxFQUFFO0lBQ3ZCLElBQUksS0FBSyxHQUFHLE9BQU8sQ0FBQyxTQUFTLEVBQUUsQ0FBQTtJQUUvQixNQUFNLFdBQVcsR0FBRyxLQUFLLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxFQUFFLFdBQVcsRUFBRSxNQUFNLEVBQUUsQ0FBQyxDQUFBO0lBRW5FLENBQUMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsV0FBVyxFQUM3QyxpREFBaUQsQ0FBQyxDQUFBO0lBRXBELENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLFlBQVksWUFBWSxNQUFNLEVBQUUsb0NBQW9DLENBQUMsQ0FBQTtJQUVoRixNQUFNLFNBQVMsR0FBRyxLQUFLLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQTtJQUU5QyxDQUFDLENBQUMsRUFBRSxDQUFDLFlBQVksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsR0FBRyxJQUFJLE9BQU8sU0FBUyxDQUFDLENBQUMsQ0FBQyxLQUFLLFVBQVUsRUFBRSxJQUFJLENBQUMsRUFDL0Ysb0NBQW9DLENBQUMsQ0FBQTtJQUV2QyxLQUFLLEdBQUcsT0FBTyxDQUFDLFNBQVMsRUFBRSxDQUFBO0lBRTNC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LENBQUMsS0FBSyxDQUNMLFdBQVcsQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUMzQixDQUFDLEVBQ0QsOEZBQThGLENBQUMsQ0FBQTtJQUVqRyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUE7QUFDVCxDQUFDLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0ZXN0IGZyb20gJ0BpbnRlcmFjdGpzL19kZXYvdGVzdC90ZXN0J1xuaW1wb3J0IFNpZ25hbHMgZnJvbSAnQGludGVyYWN0anMvdXRpbHMvU2lnbmFscydcbmltcG9ydCBJbnRlcmFjdGlvbiBmcm9tICcuL0ludGVyYWN0aW9uJ1xuaW1wb3J0IGludGVyYWN0aW9ucyBmcm9tICcuL2ludGVyYWN0aW9ucydcbmltcG9ydCAqIGFzIGhlbHBlcnMgZnJvbSAnLi90ZXN0cy9faGVscGVycydcblxudGVzdCgnaW50ZXJhY3Rpb25zJywgdCA9PiB7XG4gIGxldCBzY29wZSA9IGhlbHBlcnMubW9ja1Njb3BlKClcblxuICBjb25zdCBpbnRlcmFjdGlvbiA9IHNjb3BlLmludGVyYWN0aW9ucy5uZXcoeyBwb2ludGVyVHlwZTogJ1RFU1QnIH0pXG5cbiAgdC5lcXVhbChzY29wZS5pbnRlcmFjdGlvbnMubGlzdFswXSwgaW50ZXJhY3Rpb24sXG4gICAgJ25ldyBJbnRlcmFjdGlvbiBpcyBwdXNoZWQgdG8gc2NvcGUuaW50ZXJhY3Rpb25zJylcblxuICB0Lm9rKHNjb3BlLmludGVyYWN0aW9ucyBpbnN0YW5jZW9mIE9iamVjdCwgJ2ludGVyYWN0aW9ucyBvYmplY3QgYWRkZWQgdG8gc2NvcGUnKVxuXG4gIGNvbnN0IGxpc3RlbmVycyA9IHNjb3BlLmludGVyYWN0aW9ucy5saXN0ZW5lcnNcblxuICB0Lm9rKGludGVyYWN0aW9ucy5tZXRob2ROYW1lcy5yZWR1Y2UoKGFjYywgbSkgPT4gYWNjICYmIHR5cGVvZiBsaXN0ZW5lcnNbbV0gPT09ICdmdW5jdGlvbicsIHRydWUpLFxuICAgICdpbnRlcmFjdGlvbnMgb2JqZWN0IGFkZGVkIHRvIHNjb3BlJylcblxuICBzY29wZSA9IGhlbHBlcnMubW9ja1Njb3BlKClcblxuICBjb25zdCBuZXdJbnRlcmFjdGlvbiA9IHNjb3BlLmludGVyYWN0aW9ucy5uZXcoe30pXG5cbiAgdC5hc3NlcnQodHlwZW9mIHNjb3BlLmludGVyYWN0aW9ucyA9PT0gJ29iamVjdCcpXG4gIHQuYXNzZXJ0KHNjb3BlLmludGVyYWN0aW9ucy5zaWduYWxzIGluc3RhbmNlb2YgU2lnbmFscylcbiAgdC5hc3NlcnQodHlwZW9mIHNjb3BlLmludGVyYWN0aW9ucy5uZXcgPT09ICdmdW5jdGlvbicpXG4gIHQuYXNzZXJ0KG5ld0ludGVyYWN0aW9uIGluc3RhbmNlb2YgSW50ZXJhY3Rpb24pXG4gIHQuZXF1YWwobmV3SW50ZXJhY3Rpb24uX3NpZ25hbHMsIHNjb3BlLmludGVyYWN0aW9ucy5zaWduYWxzKVxuXG4gIHQuYXNzZXJ0KHR5cGVvZiBzY29wZS5hY3Rpb25zID09PSAnb2JqZWN0JylcbiAgdC5kZWVwRXF1YWwoc2NvcGUuYWN0aW9ucy5uYW1lcywgW10pXG4gIHQuZGVlcEVxdWFsKHNjb3BlLmFjdGlvbnMubWV0aG9kRGljdCwge30pXG5cbiAgdC5lbmQoKVxufSlcblxudGVzdCgnaW50ZXJhY3Rpb25zIGRvY3VtZW50IGV2ZW50IG9wdGlvbnMnLCB0ID0+IHtcbiAgY29uc3Qgc2NvcGUgPSBoZWxwZXJzLm1vY2tTY29wZSgpXG4gIGNvbnN0IGRvYyA9IHNjb3BlLmRvY3VtZW50XG5cbiAgbGV0IG9wdGlvbnMgPSB7fVxuICBzY29wZS5icm93c2VyID0geyBpc0lPUzogZmFsc2UgfVxuICBzY29wZS5zaWduYWxzLmZpcmUoJ2FkZC1kb2N1bWVudCcsIHsgZG9jLCBzY29wZSwgb3B0aW9ucyB9KVxuXG4gIHQuZGVlcEVxdWFsKFxuICAgIG9wdGlvbnMsXG4gICAge30sXG4gICAgJ25vIGRvYyBvcHRpb25zLmV2ZW50LnBhc3NpdmUgaXMgYWRkZWQgd2hlbiBub3QgaU9TJylcblxuICBvcHRpb25zID0ge31cblxuICBzY29wZS5icm93c2VyLmlzSU9TID0gdHJ1ZVxuICBzY29wZS5zaWduYWxzLmZpcmUoJ2FkZC1kb2N1bWVudCcsIHsgZG9jLCBzY29wZSwgb3B0aW9ucyB9KVxuXG4gIHQuZGVlcEVxdWFsKFxuICAgIG9wdGlvbnMsXG4gICAgeyBldmVudHM6IHsgcGFzc2l2ZTogZmFsc2UgfSB9LFxuICAgICdkb2Mgb3B0aW9ucy5ldmVudC5wYXNzaXZlIGlzIHNldCB0byBmYWxzZSBmb3IgaU9TJylcblxuICB0LmVuZCgpXG59KVxuXG50ZXN0KCdpbnRlcmFjdGlvbnMgcmVtb3ZlcyBwb2ludGVycyBvbiB0YXJnZXRpbmcgcmVtb3ZlZCBlbGVtZW50cycsIHQgPT4ge1xuICBjb25zdCB7XG4gICAgaW50ZXJhY3Rpb24sXG4gICAgc2NvcGUsXG4gIH0gPSBoZWxwZXJzLnRlc3RFbnYoKVxuXG4gIGNvbnN0IHsgVG91Y2hFdmVudCwgVG91Y2ggPSBmdW5jdGlvbiAoX3QpIHsgcmV0dXJuIF90IH0gfSA9IHNjb3BlLndpbmRvdyBhcyBhbnlcbiAgY29uc3QgZGl2MSA9IHNjb3BlLmRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoc2NvcGUuZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JykpXG4gIGNvbnN0IGRpdjIgPSBzY29wZS5kb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHNjb3BlLmRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpKVxuXG4gIGNvbnN0IHRvdWNoMUluaXQgPSB7IGJ1YmJsZXM6IHRydWUsIGNoYW5nZWRUb3VjaGVzOiBbbmV3IFRvdWNoKHsgaWRlbnRpZmllcjogMSwgdGFyZ2V0OiBkaXYxIH0pXSB9XG4gIGNvbnN0IHRvdWNoMkluaXQgPSB7IGJ1YmJsZXM6IHRydWUsIGNoYW5nZWRUb3VjaGVzOiBbbmV3IFRvdWNoKHsgaWRlbnRpZmllcjogMiwgdGFyZ2V0OiBkaXYyIH0pXSB9XG5cbiAgaW50ZXJhY3Rpb24ucG9pbnRlclR5cGUgPSAndG91Y2gnXG4gIGRpdjEuZGlzcGF0Y2hFdmVudChuZXcgVG91Y2hFdmVudCgndG91Y2hzdGFydCcsIHRvdWNoMUluaXQpKVxuICBkaXYxLmRpc3BhdGNoRXZlbnQobmV3IFRvdWNoRXZlbnQoJ3RvdWNobW92ZScsIHRvdWNoMUluaXQpKVxuXG4gIHQuZXF1YWwoXG4gICAgc2NvcGUuaW50ZXJhY3Rpb25zLmxpc3QubGVuZ3RoLFxuICAgIDEpXG5cbiAgdC5lcXVhbChpbnRlcmFjdGlvbi5wb2ludGVycy5sZW5ndGgsIDEsICdkb3duIHBvaW50ZXIgYWRkZWQgdG8gaW50ZXJhY3Rpb24nKVxuICB0LmVxdWFsKGludGVyYWN0aW9uLl9sYXRlc3RQb2ludGVyLmV2ZW50VGFyZ2V0LCBkaXYxLCAnX2xhdGVzdFBvaW50ZXIgdGFyZ2V0IGlzIGRvd24gdGFyZ2V0JylcblxuICBkaXYxLnJlbW92ZSgpXG5cbiAgZGl2Mi5kaXNwYXRjaEV2ZW50KG5ldyBUb3VjaEV2ZW50KCd0b3VjaHN0YXJ0JywgdG91Y2gySW5pdCkpXG5cbiAgdC5kZWVwRXF1YWwoXG4gICAgc2NvcGUuaW50ZXJhY3Rpb25zLmxpc3QsXG4gICAgW2ludGVyYWN0aW9uXSxcbiAgICAnaW50ZXJhY3Rpb24gd2l0aCByZW1vdmVkIGVsZW1lbnQgaXMgcmV1c2VkIGZvciBuZXcgcG9pbnRlcicpXG5cbiAgdC5lcXVhbChcbiAgICBpbnRlcmFjdGlvbi5wb2ludGVycy5sZW5ndGgsXG4gICAgMSxcbiAgICAncG9pbnRlciBvbiByZW1vdmVkIGVsZW1lbnQgaXMgcmVtb3ZlZCBmcm9tIGV4aXN0aW5nIGludGVyYWN0aW9uIGFuZCBuZXcgcG9pbnRlcmRvd24gaXMgYWRkZWQnKVxuXG4gIHQuZW5kKClcbn0pXG4iXX0=