import {it,expect} from 'vitest';
import {availableNow} from '@/lib/matching/availability';
const now='2026-11-14T12:00:00Z';
it('AV01 sixty-minute window includes now and excludes exact expiry',()=>{expect(availableNow('2026-11-14T13:00:00Z',now)).toBe(true);expect(availableNow(now,now)).toBe(false);expect(availableNow('2026-11-14T13:00:01Z',now)).toBe(false);});
it('AV02 malformed, absent, expired or ineligible availability is false',()=>{for(const v of [null,'invalid','2026-11-14T11:59:59Z'])expect(availableNow(v,now)).toBe(false);expect(availableNow('2026-11-14T12:30:00Z',now,false)).toBe(false);});
