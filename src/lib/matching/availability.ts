/** Expiry and eligibility are evaluated against an injected clock, never presence or a meeting guarantee. */
export function availableNow(until:string|null|undefined,asOf:string,eligible=true){const expiry=Date.parse(until??'');const clock=Date.parse(asOf);return eligible&&Number.isFinite(expiry)&&Number.isFinite(clock)&&expiry>clock&&expiry<=clock+60*60*1000;}
