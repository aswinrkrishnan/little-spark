// Plan a complete recorded reading before playing; never silently skip words.
(() => {
 function tokens(text){return String(text).replace(/\b(\d{1,2}):00\b/g, '$1 o’clock').replace(/\b(\d{1,2}):(15|30|45)\b/g, '$1 $2').toLowerCase().replace(/[’‘]/g,"'").replace(/=\s*\?/g,' equals what ').replace(/\$(\d+)/g,' $1 dollars ').replace(/\b(\d+)c\b/g,' $1 cents ').replace(/\b(\d+)s\b/g,' $1 ').replace(/−/g,' minus ').replace(/\+/g,' plus ').replace(/=/g,' equals ').replace(/_+/g,' blank ').replace(/●/g,' circle ').replace(/▲/g,' triangle ').replace(/■/g,' square ').match(/[a-z]+(?:'[a-z]+)*|\d+/g)||[]}
 function create(recordings){
  const trie=Object.create(null);for(const [text,url] of Object.entries(recordings)){const words=tokens(text);if(!words.length)continue;let node=trie;for(const word of words)node=node[word]||(node[word]=Object.create(null));node.url=url}
  function numberParts(value){const n=Number(value);if(!Number.isSafeInteger(n)||n<0||n>1000)return null;if(n<=99||n===1000)return [String(n)];const rest=n%100;return [String(Math.floor(n/100)),'hundred',...(rest?['and',String(rest)]:[])];}
  return text=>{const words=tokens(text),urls=[];for(let i=0;i<words.length;){let node=trie,best=null;for(let j=i;j<words.length&&node[words[j]];j++){node=node[words[j]];if(node.url)best={url:node.url,end:j+1}}if(best){urls.push(best.url);i=best.end;continue}if(/^\d+$/.test(words[i])){const parts=numberParts(words[i]);if(parts&&parts.every(p=>trie[p]?.url)){urls.push(...parts.map(p=>trie[p].url));i++;continue}}return null}return urls.length?urls:null};
 }
 window.sparkAudioPlan={tokens,create};
})();
