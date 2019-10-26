import extend from '@interactjs/utils/extend';
import getOriginXY from '@interactjs/utils/getOriginXY';
import hypot from '@interactjs/utils/hypot';
import BaseEvent from './BaseEvent';
import defaults from './defaultOptions';
export var EventPhase;
(function (EventPhase) {
    EventPhase["Start"] = "start";
    EventPhase["Move"] = "move";
    EventPhase["End"] = "end";
    EventPhase["_NONE"] = "";
})(EventPhase || (EventPhase = {}));
export class InteractEvent extends BaseEvent {
    /** */
    constructor(interaction, event, actionName, phase, element, related, preEnd, type) {
        super(interaction);
        element = element || interaction.element;
        const target = interaction.interactable;
        const deltaSource = ((target && target.options) || defaults).deltaSource;
        const origin = getOriginXY(target, element, actionName);
        const starting = phase === 'start';
        const ending = phase === 'end';
        const prevEvent = starting ? this : interaction.prevEvent;
        const coords = starting
            ? interaction.coords.start
            : ending
                ? { page: prevEvent.page, client: prevEvent.client, timeStamp: interaction.coords.cur.timeStamp }
                : interaction.coords.cur;
        this.page = extend({}, coords.page);
        this.client = extend({}, coords.client);
        this.rect = extend({}, interaction.rect);
        this.timeStamp = coords.timeStamp;
        if (!ending) {
            this.page.x -= origin.x;
            this.page.y -= origin.y;
            this.client.x -= origin.x;
            this.client.y -= origin.y;
        }
        this.ctrlKey = event.ctrlKey;
        this.altKey = event.altKey;
        this.shiftKey = event.shiftKey;
        this.metaKey = event.metaKey;
        this.button = event.button;
        this.buttons = event.buttons;
        this.target = element;
        this.currentTarget = element;
        this.relatedTarget = related || null;
        this.preEnd = preEnd;
        this.type = type || (actionName + (phase || ''));
        this.interactable = target;
        this.t0 = starting
            ? interaction.pointers[interaction.pointers.length - 1].downTime
            : prevEvent.t0;
        this.x0 = interaction.coords.start.page.x - origin.x;
        this.y0 = interaction.coords.start.page.y - origin.y;
        this.clientX0 = interaction.coords.start.client.x - origin.x;
        this.clientY0 = interaction.coords.start.client.y - origin.y;
        if (starting || ending) {
            this.delta = { x: 0, y: 0 };
        }
        else {
            this.delta = {
                x: this[deltaSource].x - prevEvent[deltaSource].x,
                y: this[deltaSource].y - prevEvent[deltaSource].y,
            };
        }
        this.dt = interaction.coords.delta.timeStamp;
        this.duration = this.timeStamp - this.t0;
        // velocity and speed in pixels per second
        this.velocity = extend({}, interaction.coords.velocity[deltaSource]);
        this.speed = hypot(this.velocity.x, this.velocity.y);
        this.swipe = (ending || phase === 'inertiastart') ? this.getSwipe() : null;
    }
    get pageX() { return this.page.x; }
    set pageX(value) { this.page.x = value; }
    get pageY() { return this.page.y; }
    set pageY(value) { this.page.y = value; }
    get clientX() { return this.client.x; }
    set clientX(value) { this.client.x = value; }
    get clientY() { return this.client.y; }
    set clientY(value) { this.client.y = value; }
    get dx() { return this.delta.x; }
    set dx(value) { this.delta.x = value; }
    get dy() { return this.delta.y; }
    set dy(value) { this.delta.y = value; }
    get velocityX() { return this.velocity.x; }
    set velocityX(value) { this.velocity.x = value; }
    get velocityY() { return this.velocity.y; }
    set velocityY(value) { this.velocity.y = value; }
    getSwipe() {
        const interaction = this._interaction;
        if (interaction.prevEvent.speed < 600 ||
            this.timeStamp - interaction.prevEvent.timeStamp > 150) {
            return null;
        }
        let angle = 180 * Math.atan2(interaction.prevEvent.velocityY, interaction.prevEvent.velocityX) / Math.PI;
        const overlap = 22.5;
        if (angle < 0) {
            angle += 360;
        }
        const left = 135 - overlap <= angle && angle < 225 + overlap;
        const up = 225 - overlap <= angle && angle < 315 + overlap;
        const right = !left && (315 - overlap <= angle || angle < 45 + overlap);
        const down = !up && 45 - overlap <= angle && angle < 135 + overlap;
        return {
            up,
            down,
            left,
            right,
            angle,
            speed: interaction.prevEvent.speed,
            velocity: {
                x: interaction.prevEvent.velocityX,
                y: interaction.prevEvent.velocityY,
            },
        };
    }
    preventDefault() { }
    /**
     * Don't call listeners on the remaining targets
     */
    stopImmediatePropagation() {
        this.immediatePropagationStopped = this.propagationStopped = true;
    }
    /**
     * Don't call any other listeners (even on the current target)
     */
    stopPropagation() {
        this.propagationStopped = true;
    }
}
export default InteractEvent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSW50ZXJhY3RFdmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIkludGVyYWN0RXZlbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxNQUFNLE1BQU0sMEJBQTBCLENBQUE7QUFDN0MsT0FBTyxXQUFXLE1BQU0sK0JBQStCLENBQUE7QUFDdkQsT0FBTyxLQUFLLE1BQU0seUJBQXlCLENBQUE7QUFDM0MsT0FBTyxTQUFTLE1BQU0sYUFBYSxDQUFBO0FBQ25DLE9BQU8sUUFBUSxNQUFNLGtCQUFrQixDQUFBO0FBSXZDLE1BQU0sQ0FBTixJQUFZLFVBS1g7QUFMRCxXQUFZLFVBQVU7SUFDcEIsNkJBQWUsQ0FBQTtJQUNmLDJCQUFhLENBQUE7SUFDYix5QkFBVyxDQUFBO0lBQ1gsd0JBQVUsQ0FBQTtBQUNaLENBQUMsRUFMVyxVQUFVLEtBQVYsVUFBVSxRQUtyQjtBQUVELE1BQU0sT0FBTyxhQUdYLFNBQVEsU0FBWTtJQWtDcEIsTUFBTTtJQUNOLFlBQ0UsV0FBd0IsRUFDeEIsS0FBZ0MsRUFDaEMsVUFBYSxFQUNiLEtBQVEsRUFDUixPQUF5QixFQUN6QixPQUEwQixFQUMxQixNQUFnQixFQUNoQixJQUFhO1FBRWIsS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFBO1FBRWxCLE9BQU8sR0FBRyxPQUFPLElBQUksV0FBVyxDQUFDLE9BQU8sQ0FBQTtRQUV4QyxNQUFNLE1BQU0sR0FBUSxXQUFXLENBQUMsWUFBWSxDQUFBO1FBQzVDLE1BQU0sV0FBVyxHQUFJLENBQUMsQ0FBQyxNQUFNLElBQUksTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLFFBQVEsQ0FBUyxDQUFDLFdBQWdDLENBQUE7UUFDdEcsTUFBTSxNQUFNLEdBQVEsV0FBVyxDQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsVUFBVSxDQUFDLENBQUE7UUFDNUQsTUFBTSxRQUFRLEdBQU0sS0FBSyxLQUFLLE9BQU8sQ0FBQTtRQUNyQyxNQUFNLE1BQU0sR0FBUSxLQUFLLEtBQUssS0FB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SSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUE7SUFDNUUsQ0FBQztJQUVELElBQUksS0FBSyxLQUFNLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUEsQ0FBQyxDQUFDO0lBQ25DLElBQUksS0FBSyxDQUFFLEtBQUssSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUEsQ0FBQyxDQUFDO0lBQ3pDLElBQUksS0FBSyxLQUFNLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUEsQ0FBQyxDQUFDO0lBQ25DLElBQUksS0FBSyxDQUFFLEtBQUssSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUEsQ0FBQyxDQUFDO0lBRXpDLElBQUksT0FBTyxLQUFNLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUEsQ0FBQyxDQUFDO0lBQ3ZDLElBQUksT0FBTyxDQUFFLEtBQUssSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUEsQ0FBQyxDQUFDO0lBQzdDLElBQUksT0FBTyxLQUFNLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUEsQ0FBQyxDQUFDO0lBQ3ZDLElBQUksT0FBTyxDQUFFLEtBQUssSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUEsQ0FBQyxDQUFDO0lBRTdDLElBQUksRUFBRSxLQUFNLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUEsQ0FBQyxDQUFDO0lBQ2pDLElBQUksRUFBRSxDQUFFLEtBQUssSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUEsQ0FBQyxDQUFDO0lBQ3ZDLElBQUksRUFBRSxLQUFNLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUEsQ0FBQyxDQUFDO0lBQ2pDLElBQUksRUFBRSxDQUFFLEtBQUssSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUEsQ0FBQyxDQUFDO0lBRXZDLElBQUksU0FBUyxLQUFNLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUEsQ0FBQyxDQUFDO0lBQzNDLElBQUksU0FBUyxDQUFFLEtBQUssSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUEsQ0FBQyxDQUFDO0lBQ2pELElBQUksU0FBUyxLQUFNLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUEsQ0FBQyxDQUFDO0lBQzNDLElBQUksU0FBUyxDQUFFLEtBQUssSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUEsQ0FBQyxDQUFDO0lBRWpELFFBQVE7UUFDTixNQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFBO1FBRXJDLElBQUksV0FBVyxDQUFDLFNBQVMsQ0FBQyxLQUFLLEdBQUcsR0FBRztZQUNqQyxJQUFJLENBQUMsU0FBUyxHQUFHLFdBQVcsQ0FBQyxTQUFTLENBQUMsU0FBUyxHQUFHLEdBQUcsRUFBRTtZQUMxRCxPQUFPLElBQUksQ0FBQTtTQUNaO1FBRUQsSUFBSSxLQUFLLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxTQUFTLEVBQUUsV0FBVyxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFBO1FBQ3hHLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQTtRQUVwQixJQUFJLEtBQUssR0FBRyxDQUFDLEVBQUU7WUFDYixLQUFLLElBQUksR0FBRyxDQUFBO1NBQ2I7UUFFRCxNQUFNLElBQUksR0FBRyxHQUFHLEdBQUcsT0FBTyxJQUFJLEtBQUssSUFBSSxLQUFLLEdBQUcsR0FBRyxHQUFHLE9BQU8sQ0FBQTtRQUM1RCxNQUFNLEVBQUUsR0FBSyxHQUFHLEdBQUcsT0FBTyxJQUFJLEtBQUssSUFBSSxLQUFLLEdBQUcsR0FBRyxHQUFHLE9BQU8sQ0FBQTtRQUU1RCxNQUFNLEtBQUssR0FBRyxDQUFDLElBQUksSUFBSSxDQUFDLEdBQUcsR0FBRyxPQUFPLElBQUksS0FBSyxJQUFJLEtBQUssR0FBSSxFQUFFLEdBQUcsT0FBTyxDQUFDLENBQUE7UUFDeEUsTUFBTSxJQUFJLEdBQUksQ0FBQyxFQUFFLElBQVEsRUFBRSxHQUFHLE9BQU8sSUFBSSxLQUFLLElBQUksS0FBSyxHQUFHLEdBQUcsR0FBRyxPQUFPLENBQUE7UUFFdkUsT0FBTztZQUNMLEVBQUU7WUFDRixJQUFJO1lBQ0osSUFBSTtZQUNKLEtBQUs7WUFDTCxLQUFLO1lBQ0wsS0FBSyxFQUFFLFdBQVcsQ0FBQyxTQUFTLENBQUMsS0FBSztZQUNsQyxRQUFRLEVBQUU7Z0JBQ1IsQ0FBQyxFQUFFLFdBQVcsQ0FBQyxTQUFTLENBQUMsU0FBUztnQkFDbEMsQ0FBQyxFQUFFLFdBQVcsQ0FBQyxTQUFTLENBQUMsU0FBUzthQUNuQztTQUNGLENBQUE7SUFDSCxDQUFDO0lBRUQsY0FBYyxLQUFLLENBQUM7SUFFcEI7O09BRUc7SUFDSCx3QkFBd0I7UUFDdEIsSUFBSSxDQUFDLDJCQUEyQixHQUFHLElBQUksQ0FBQyxrQkFBa0IsR0FBRyxJQUFJLENBQUE7SUFDbkUsQ0FBQztJQUVEOztPQUVHO0lBQ0gsZUFBZTtRQUNiLElBQUksQ0FBQyxrQkFBa0IsR0FBRyxJQUFJLENBQUE7SUFDaEMsQ0FBQztDQUNGO0FBRUQsZUFBZSxhQUFhLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgZXh0ZW5kIGZyb20gJ0BpbnRlcmFjdGpzL3V0aWxzL2V4dGVuZCdcbmltcG9ydCBnZXRPcmlnaW5YWSBmcm9tICdAaW50ZXJhY3Rqcy91dGlscy9nZXRPcmlnaW5YWSdcbmltcG9ydCBoeXBvdCBmcm9tICdAaW50ZXJhY3Rqcy91dGlscy9oeXBvdCdcbmltcG9ydCBCYXNlRXZlbnQgZnJvbSAnLi9CYXNlRXZlbnQnXG5pbXBvcnQgZGVmYXVsdHMgZnJvbSAnLi9kZWZhdWx0T3B0aW9ucydcbmltcG9ydCBJbnRlcmFjdGlvbiBmcm9tICcuL0ludGVyYWN0aW9uJ1xuaW1wb3J0IHsgQWN0aW9uTmFtZSB9IGZyb20gJy4vc2NvcGUnXG5cbmV4cG9ydCBlbnVtIEV2ZW50UGhhc2Uge1xuICBTdGFydCA9ICdzdGFydCcsXG4gIE1vdmUgPSAnbW92ZScsXG4gIEVuZCA9ICdlbmQnLFxuICBfTk9ORSA9ICcnLFxufVxuXG5leHBvcnQgY2xhc3MgSW50ZXJhY3RFdmVudDxcbiAgVCBleHRlbmRzIEFjdGlvbk5hbWUgPSBhbnksXG4gIFAgZXh0ZW5kcyBFdmVudFBoYXNlID0gRXZlbnRQaGFzZS5fTk9ORSxcbj4gZXh0ZW5kcyBCYXNlRXZlbnQ8VD4ge1xuICB0YXJnZXQ6IEludGVyYWN0LkVsZW1lbnRcbiAgY3VycmVudFRhcmdldDogSW50ZXJhY3QuRWxlbWVudFxuICByZWxhdGVkVGFyZ2V0OiBJbnRlcmFjdC5FbGVtZW50XG4gIHNjcmVlblg/OiBudW1iZXJcbiAgc2NyZWVuWT86IG51bWJlclxuICBidXR0b246IG51bWJlclxuICBidXR0b25zOiBudW1iZXJcbiAgY3RybEtleTogYm9vbGVhblxuICBzaGlmdEtleTogYm9vbGVhblxuICBhbHRLZXk6IGJvb2xlYW5cbiAgbWV0YUtleTogYm9vbGVhblxuICBwYWdlOiBJbnRlcmFjdC5Qb2ludFxuICBjbGllbnQ6IEludGVyYWN0LlBvaW50XG4gIGRlbHRhOiBJbnRlcmFjdC5Qb2ludFxuICByZWN0OiBJbnRlcmFjdC5GdWxsUmVjdFxuICB4MDogbnVtYmVyXG4gIHkwOiBudW1iZXJcbiAgdDA6IG51bWJlclxuICBkdDogbnVtYmVyXG4gIGR1cmF0aW9uOiBudW1iZXJcbiAgY2xpZW50WDA6IG51bWJlclxuICBjbGllbnRZMDogbnVtYmVyXG4gIHZlbG9jaXR5OiBJbnRlcmFjdC5Qb2ludFxuICBzcGVlZDogbnVtYmVyXG4gIHN3aXBlOiBSZXR1cm5UeXBlPEludGVyYWN0RXZlbnQ8VD5bJ2dldFN3aXBlJ10+XG4gIHRpbWVTdGFtcDogYW55XG4gIC8vIGRyYWdcbiAgZHJhZ0VudGVyPzogSW50ZXJhY3QuRWxlbWVudFxuICBkcmFnTGVhdmU/OiBJbnRlcmFjdC5FbGVtZW50XG4gIC8vIHJlc2l6ZVxuICBheGVzPzogJ3gnIHwgJ3knIHwgJ3h5J1xuICBwcmVFbmQ/OiBib29sZWFuXG5cbiAgLyoqICovXG4gIGNvbnN0cnVjdG9yIChcbiAgICBpbnRlcmFjdGlvbjogSW50ZXJhY3Rpb24sXG4gICAgZXZlbnQ6IEludGVyYWN0LlBvaW50ZXJFdmVudFR5cGUsXG4gICAgYWN0aW9uTmFtZTogVCxcbiAgICBwaGFzZTogUCxcbiAgICBlbGVtZW50OiBJbnRlcmFjdC5FbGVtZW50LFxuICAgIHJlbGF0ZWQ/OiBJbnRlcmFjdC5FbGVtZW50LFxuICAgIHByZUVuZD86IGJvb2xlYW4sXG4gICAgdHlwZT86IHN0cmluZyxcbiAgKSB7XG4gICAgc3VwZXIoaW50ZXJhY3Rpb24pXG5cbiAgICBlbGVtZW50ID0gZWxlbWVudCB8fCBpbnRlcmFjdGlvbi5lbGVtZW50XG5cbiAgICBjb25zdCB0YXJnZXQgICAgICA9IGludGVyYWN0aW9uLmludGVyYWN0YWJsZVxuICAgIGNvbnN0IGRlbHRhU291cmNlID0gKCgodGFyZ2V0ICYmIHRhcmdldC5vcHRpb25zKSB8fCBkZWZhdWx0cykgYXMgYW55KS5kZWx0YVNvdXJjZSBhcyAncGFnZScgfCAnY2xpZW50J1xuICAgIGNvbnN0IG9yaWdpbiAgICAgID0gZ2V0T3JpZ2luWFkodGFyZ2V0LCBlbGVtZW50LCBhY3Rpb25OYW1lKVxuICAgIGNvbnN0IHN0YXJ0aW5nICAgID0gcGhhc2UgPT09ICdzdGFydCdcbiAgICBjb25zdCBlbmRpbmcgICAgICA9IHBoYXNlID09PSAnZW5kJ1xuICAgIGNvbnN0IHByZXZFdmVudCAgID0gc3RhcnRpbmcgPyB0aGlzIDogaW50ZXJhY3Rpb24ucHJldkV2ZW50XG4gICAgY29uc3QgY29vcmRzICAgICAgPSBzdGFydGluZ1xuICAgICAgPyBpbnRlcmFjdGlvbi5jb29yZHMuc3RhcnRcbiAgICAgIDogZW5kaW5nXG4gICAgICAgID8geyBwYWdlOiBwcmV2RXZlbnQucGFnZSwgY2xpZW50OiBwcmV2RXZlbnQuY2xpZW50LCB0aW1lU3RhbXA6IGludGVyYWN0aW9uLmNvb3Jkcy5jdXIudGltZVN0YW1wIH1cbiAgICAgICAgOiBpbnRlcmFjdGlvbi5jb29yZHMuY3VyXG5cbiAgICB0aGlzLnBhZ2UgICAgICA9IGV4dGVuZCh7fSwgY29vcmRzLnBhZ2UpXG4gICAgdGhpcy5jbGllbnQgICAgPSBleHRlbmQoe30sIGNvb3Jkcy5jbGllbnQpXG4gICAgdGhpcy5yZWN0ICAgICAgPSBleHRlbmQoe30sIGludGVyYWN0aW9uLnJlY3QpXG4gICAgdGhpcy50aW1lU3RhbXAgPSBjb29yZHMudGltZVN0YW1wXG5cbiAgICBpZiAoIWVuZGluZykge1xuICAgICAgdGhpcy5wYWdlLnggLT0gb3JpZ2luLnhcbiAgICAgIHRoaXMucGFnZS55IC09IG9yaWdpbi55XG5cbiAgICAgIHRoaXMuY2xpZW50LnggLT0gb3JpZ2luLnhcbiAgICAgIHRoaXMuY2xpZW50LnkgLT0gb3JpZ2luLnlcbiAgICB9XG5cbiAgICB0aGlzLmN0cmxLZXkgICAgICAgPSBldmVudC5jdHJsS2V5XG4gICAgdGhpcy5hbHRLZXkgICAgICAgID0gZXZlbnQuYWx0S2V5XG4gICAgdGhpcy5zaGlmdEtleSAgICAgID0gZXZlbnQuc2hpZnRLZXlcbiAgICB0aGlzLm1ldGFLZXkgICAgICAgPSBldmVudC5tZXRhS2V5XG4gICAgdGhpcy5idXR0b24gICAgICAgID0gKGV2ZW50IGFzIE1vdXNlRXZlbnQpLmJ1dHRvblxuICAgIHRoaXMuYnV0dG9ucyAgICAgICA9IChldmVudCBhcyBNb3VzZUV2ZW50KS5idXR0b25zXG4gICAgdGhpcy50YXJnZXQgICAgICAgID0gZWxlbWVudFxuICAgIHRoaXMuY3VycmVudFRhcmdldCA9IGVsZW1lbnRcbiAgICB0aGlzLnJlbGF0ZWRUYXJnZXQgPSByZWxhdGVkIHx8IG51bGxcbiAgICB0aGlzLnByZUVuZCAgICAgICAgPSBwcmVFbmRcbiAgICB0aGlzLnR5cGUgICAgICAgICAgPSB0eXBlIHx8IChhY3Rpb25OYW1lICsgKHBoYXNlIHx8ICcnKSlcbiAgICB0aGlzLmludGVyYWN0YWJsZSAgPSB0YXJnZXRcblxuICAgIHRoaXMudDAgPSBzdGFydGluZ1xuICAgICAgPyBpbnRlcmFjdGlvbi5wb2ludGVyc1tpbnRlcmFjdGlvbi5wb2ludGVycy5sZW5ndGggLSAxXS5kb3duVGltZVxuICAgICAgOiBwcmV2RXZlbnQudDBcblxuICAgIHRoaXMueDAgICAgICAgPSBpbnRlcmFjdGlvbi5jb29yZHMuc3RhcnQucGFnZS54IC0gb3JpZ2luLnhcbiAgICB0aGlzLnkwICAgICAgID0gaW50ZXJhY3Rpb24uY29vcmRzLnN0YXJ0LnBhZ2UueSAtIG9yaWdpbi55XG4gICAgdGhpcy5jbGllbnRYMCA9IGludGVyYWN0aW9uLmNvb3Jkcy5zdGFydC5jbGllbnQueCAtIG9yaWdpbi54XG4gICAgdGhpcy5jbGllbnRZMCA9IGludGVyYWN0aW9uLmNvb3Jkcy5zdGFydC5jbGllbnQueSAtIG9yaWdpbi55XG5cbiAgICBpZiAoc3RhcnRpbmcgfHwgZW5kaW5nKSB7XG4gICAgICB0aGlzLmRlbHRhID0geyB4OiAwLCB5OiAwIH1cbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICB0aGlzLmRlbHRhID0ge1xuICAgICAgICB4OiB0aGlzW2RlbHRhU291cmNlXS54IC0gcHJldkV2ZW50W2RlbHRhU291cmNlXS54LFxuICAgICAgICB5OiB0aGlzW2RlbHRhU291cmNlXS55IC0gcHJldkV2ZW50W2RlbHRhU291cmNlXS55LFxuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuZHQgICAgICAgID0gaW50ZXJhY3Rpb24uY29vcmRzLmRlbHRhLnRpbWVTdGFtcFxuICAgIHRoaXMuZHVyYXRpb24gID0gdGhpcy50aW1lU3RhbXAgLSB0aGlzLnQwXG5cbiAgICAvLyB2ZWxvY2l0eSBhbmQgc3BlZWQgaW4gcGl4ZWxzIHBlciBzZWNvbmRcbiAgICB0aGlzLnZlbG9jaXR5ID0gZXh0ZW5kKHt9LCBpbnRlcmFjdGlvbi5jb29yZHMudmVsb2NpdHlbZGVsdGFTb3VyY2VdKVxuICAgIHRoaXMuc3BlZWQgPSBoeXBvdCh0aGlzLnZlbG9jaXR5LngsIHRoaXMudmVsb2NpdHkueSlcblxuICAgIHRoaXMuc3dpcGUgPSAoZW5kaW5nIHx8IHBoYXNlID09PSAnaW5lcnRpYXN0YXJ0JykgPyB0aGlzLmdldFN3aXBlKCkgOiBudWxsXG4gIH1cblxuICBnZXQgcGFnZVggKCkgeyByZXR1cm4gdGhpcy5wYWdlLnggfVxuICBzZXQgcGFnZVggKHZhbHVlKSB7IHRoaXMucGFnZS54ID0gdmFsdWUgfVxuICBnZXQgcGFnZVkgKCkgeyByZXR1cm4gdGhpcy5wYWdlLnkgfVxuICBzZXQgcGFnZVkgKHZhbHVlKSB7IHRoaXMucGFnZS55ID0gdmFsdWUgfVxuXG4gIGdldCBjbGllbnRYICgpIHsgcmV0dXJuIHRoaXMuY2xpZW50LnggfVxuICBzZXQgY2xpZW50WCAodmFsdWUpIHsgdGhpcy5jbGllbnQueCA9IHZhbHVlIH1cbiAgZ2V0IGNsaWVudFkgKCkgeyByZXR1cm4gdGhpcy5jbGllbnQueSB9XG4gIHNldCBjbGllbnRZICh2YWx1ZSkgeyB0aGlzLmNsaWVudC55ID0gdmFsdWUgfVxuXG4gIGdldCBkeCAoKSB7IHJldHVybiB0aGlzLmRlbHRhLnggfVxuICBzZXQgZHggKHZhbHVlKSB7IHRoaXMuZGVsdGEueCA9IHZhbHVlIH1cbiAgZ2V0IGR5ICgpIHsgcmV0dXJuIHRoaXMuZGVsdGEueSB9XG4gIHNldCBkeSAodmFsdWUpIHsgdGhpcy5kZWx0YS55ID0gdmFsdWUgfVxuXG4gIGdldCB2ZWxvY2l0eVggKCkgeyByZXR1cm4gdGhpcy52ZWxvY2l0eS54IH1cbiAgc2V0IHZlbG9jaXR5WCAodmFsdWUpIHsgdGhpcy52ZWxvY2l0eS54ID0gdmFsdWUgfVxuICBnZXQgdmVsb2NpdHlZICgpIHsgcmV0dXJuIHRoaXMudmVsb2NpdHkueSB9XG4gIHNldCB2ZWxvY2l0eVkgKHZhbHVlKSB7IHRoaXMudmVsb2NpdHkueSA9IHZhbHVlIH1cblxuICBnZXRTd2lwZSAoKSB7XG4gICAgY29uc3QgaW50ZXJhY3Rpb24gPSB0aGlzLl9pbnRlcmFjdGlvblxuXG4gICAgaWYgKGludGVyYWN0aW9uLnByZXZFdmVudC5zcGVlZCA8IDYwMCB8fFxuICAgICAgICB0aGlzLnRpbWVTdGFtcCAtIGludGVyYWN0aW9uLnByZXZFdmVudC50aW1lU3RhbXAgPiAxNTApIHtcbiAgICAgIHJldHVybiBudWxsXG4gICAgfVxuXG4gICAgbGV0IGFuZ2xlID0gMTgwICogTWF0aC5hdGFuMihpbnRlcmFjdGlvbi5wcmV2RXZlbnQudmVsb2NpdHlZLCBpbnRlcmFjdGlvbi5wcmV2RXZlbnQudmVsb2NpdHlYKSAvIE1hdGguUElcbiAgICBjb25zdCBvdmVybGFwID0gMjIuNVxuXG4gICAgaWYgKGFuZ2xlIDwgMCkge1xuICAgICAgYW5nbGUgKz0gMzYwXG4gICAgfVxuXG4gICAgY29uc3QgbGVmdCA9IDEzNSAtIG92ZXJsYXAgPD0gYW5nbGUgJiYgYW5nbGUgPCAyMjUgKyBvdmVybGFwXG4gICAgY29uc3QgdXAgICA9IDIyNSAtIG92ZXJsYXAgPD0gYW5nbGUgJiYgYW5nbGUgPCAzMTUgKyBvdmVybGFwXG5cbiAgICBjb25zdCByaWdodCA9ICFsZWZ0ICYmICgzMTUgLSBvdmVybGFwIDw9IGFuZ2xlIHx8IGFuZ2xlIDwgIDQ1ICsgb3ZlcmxhcClcbiAgICBjb25zdCBkb3duICA9ICF1cCAgICYmICAgNDUgLSBvdmVybGFwIDw9IGFuZ2xlICYmIGFuZ2xlIDwgMTM1ICsgb3ZlcmxhcFxuXG4gICAgcmV0dXJuIHtcbiAgICAgIHVwLFxuICAgICAgZG93bixcbiAgICAgIGxlZnQsXG4gICAgICByaWdodCxcbiAgICAgIGFuZ2xlLFxuICAgICAgc3BlZWQ6IGludGVyYWN0aW9uLnByZXZFdmVudC5zcGVlZCxcbiAgICAgIHZlbG9jaXR5OiB7XG4gICAgICAgIHg6IGludGVyYWN0aW9uLnByZXZFdmVudC52ZWxvY2l0eVgsXG4gICAgICAgIHk6IGludGVyYWN0aW9uLnByZXZFdmVudC52ZWxvY2l0eVksXG4gICAgICB9LFxuICAgIH1cbiAgfVxuXG4gIHByZXZlbnREZWZhdWx0ICgpIHt9XG5cbiAgLyoqXG4gICAqIERvbid0IGNhbGwgbGlzdGVuZXJzIG9uIHRoZSByZW1haW5pbmcgdGFyZ2V0c1xuICAgKi9cbiAgc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uICgpIHtcbiAgICB0aGlzLmltbWVkaWF0ZVByb3BhZ2F0aW9uU3RvcHBlZCA9IHRoaXMucHJvcGFnYXRpb25TdG9wcGVkID0gdHJ1ZVxuICB9XG5cbiAgLyoqXG4gICAqIERvbid0IGNhbGwgYW55IG90aGVyIGxpc3RlbmVycyAoZXZlbiBvbiB0aGUgY3VycmVudCB0YXJnZXQpXG4gICAqL1xuICBzdG9wUHJvcGFnYXRpb24gKCkge1xuICAgIHRoaXMucHJvcGFnYXRpb25TdG9wcGVkID0gdHJ1ZVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEludGVyYWN0RXZlbnRcbiJdfQ==