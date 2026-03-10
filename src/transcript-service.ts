export interface CaptionTrack {
  baseUrl: string;
  name: {
    simpleText: string;
  };
  vssId: string;
  languageCode: string;
  kind?: string;
  isTranslatable: boolean;
}

function convertSecondsToMinutes(seconds: string | number): string {
  const totalSeconds = typeof seconds === 'string' ? parseFloat(seconds) : seconds;
  
  const minutes = Math.floor(totalSeconds / 60);
  const remainingSeconds = Math.floor(totalSeconds % 60);

  
  const formattedSeconds = remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;

  return `${minutes}:${formattedSeconds}`;
}

export async function getVideoTitle(videoId: string): Promise<string> {
    try {
       
        const response = await fetch(`https://www.youtube.com/watch?v=${videoId}`);
        const videoPageHtml = await response.text();
        
        const titleMatch = videoPageHtml.match(/<title>(.*?)<\/title>/);
        if (!titleMatch) {
            console.log('video title not found!!!');
            return "Unknown Title";
        }

       
        return titleMatch[1].replace("- YouTube", "").trim();
    } catch (error) {
        console.log('Error fetching video page:', error);
        return "Unknown Title";
    }
}

export async function getYouTubeTranscript(videoId: string): Promise<string | null> {
    try {
       
        const response = await fetch(`https://www.youtube.com/watch?v=${videoId}`);
        const html = await response.text();

      
        const captionTracks = await getCaptionTracks(videoId, html);

        if (!captionTracks || captionTracks.length === 0) {
            console.log('No caption tracks found.');
            return null;
        }

        
        const sortedCaptionTracks = sortCaptionsByLanguage(captionTracks, 'en'); // 'en' is safer for languageCode

        const firstCaptionTrack = sortedCaptionTracks[0];

      
        const XMLTranscript = await getXMLTranscript(firstCaptionTrack.baseUrl);

        const formattedTranscript = XMLTranscript.map(item => ({
            ...item,
            start: convertSecondsToMinutes(item.start),
            duration: convertSecondsToMinutes(item.duration),
        }));

        return JSON.stringify(formattedTranscript);

    } catch (error) {
        console.error('Error while finding video transcript:', error);
        return null;
    }
}


async function getCaptionTracks(videoId: string, html: string): Promise<CaptionTrack[]> {
    try {
        const splitHtml = html.split('"captions":');

        if (splitHtml.length < 2) {
            console.log("No captions available in HTML");
            return [];
        }

        const captionsJsonRaw = splitHtml[1].split(',"videoDetails"')[0];
        const captionsData = JSON.parse(captionsJsonRaw);

       
        const captionTracks: CaptionTrack[] = captionsData.playerCaptionsTracklistRenderer.captionTracks.map((track: any) => ({
            language: track.name.simpleText, 
            baseUrl: track.baseUrl,
           
            languageCode: track.languageCode
        }));

        return captionTracks;
    } catch (error) {
        console.error("Error parsing caption tracks:", error);
        return [];
    }
}


function sortCaptionsByLanguage(captionTracks: CaptionTrack[], desiredLanguage: string): CaptionTrack[] {
    captionTracks.sort((x: CaptionTrack, y: CaptionTrack) => {

        if (x.languageCode === desiredLanguage && y.languageCode !== desiredLanguage) return -1;
        if (y.languageCode === desiredLanguage && x.languageCode !== desiredLanguage) return 1;
        
       
        if (x.languageCode.includes(desiredLanguage) && !y.languageCode.includes(desiredLanguage)) return -1;
        if (y.languageCode.includes(desiredLanguage) && !x.languageCode.includes(desiredLanguage)) return 1;
        
        return 0;
    });
    return captionTracks;
}

async function getXMLTranscript(link: string): Promise<TranscriptItem[]>{
   
        const transcriptPageResponse = fetch(link);
        if(!(await transcriptPageResponse).ok){
            console.log('failed to fetch transcript page');
            throw new Error('Error fetching XML transcript')
        }
        const transcriptPageXml = (await transcriptPageResponse).text();
    
    
        const parser =new DOMParser();

        const xmlDoc = parser.parseFromString(await transcriptPageXml,"text/xml");

        const textNodes = xmlDoc.getElementsByTagName("text");

        const transcript: TranscriptItem[]= Array.from(textNodes).map((node :Element)=>({
            start: node.getAttribute("start") || "0",

            duration: node.getAttribute("dur") || "0",

            text: node.textContent?.replace(/\n/g,"").trim()||""
        }));
    
    return transcript;
}

export interface TranscriptItem{
    start: string;
    duration: string;
    text: string;
}