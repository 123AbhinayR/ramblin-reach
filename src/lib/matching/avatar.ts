const colors=[['#e5eef8','#244a70'],['#ede7f7','#584475'],['#e2efe8','#315c46'],['#f5eadf','#795332'],['#e4eef0','#315b66'],['#f1e5eb','#74445d']] as const;
export function avatarColor(name:string){const hash=[...name].reduce((n,c)=>(n*31+c.charCodeAt(0))>>>0,0);const [background,color]=colors[hash%colors.length];return {background,color};}
