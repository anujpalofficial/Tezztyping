import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Settings, Keyboard, RefreshCcw, Info, BarChart3, Volume2, VolumeX, Sun, Type, Sliders, Maximize, GraduationCap, Headphones, Gamepad2, PlayCircle, LockKeyhole, ArrowLeft, Play, Rewind, Search, AppWindow, SquareMenu, Camera, Video, Mail } from 'lucide-react';

// ==========================================
// 1. CONSTANTS, DICTIONARIES & CONFIGURATION
// ==========================================

const THEMES = {
  indian: { id: 'indian', name: 'Indian (Default)', bg: '#fdfdfd', main: '#138808', sub: '#cbd5e1', text: '#FF9933', error: '#ef4444' },
  dark: { id: 'dark', name: 'Dark Void', bg: '#0f172a', main: '#38bdf8', sub: '#475569', text: '#f8fafc', error: '#f43f5e' },
  light: { id: 'light', name: 'Clean Light', bg: '#ffffff', main: '#0ea5e9', sub: '#94a3b8', text: '#0f172a', error: '#ef4444' },
  saffron: { id: 'saffron', name: 'Deep Saffron', bg: '#1a1005', main: '#FF9933', sub: '#7a5a3a', text: '#fff3e0', error: '#e11d48' },
  terminal: { id: 'terminal', name: 'Hacker Terminal', bg: '#000000', main: '#22c55e', sub: '#166534', text: '#4ade80', error: '#dc2626' },
  monokai: { id: 'monokai', name: 'Monokai', bg: '#272822', main: '#a6e22e', sub: '#75715e', text: '#f8f8f2', error: '#f92672' },
  cyberpunk: { id: 'cyberpunk', name: 'Cyberpunk', bg: '#fef08a', main: '#06b6d4', sub: '#f59e0b', text: '#1e3a8a', error: '#e11d48' },
};

const FONTS = [
  { id: 'inter', name: 'Inter (Default)', family: "'Inter', sans-serif" },
  { id: 'roboto_mono', name: 'Roboto Mono', family: "'Roboto Mono', monospace" },
  { id: 'fira_code', name: 'Fira Code', family: "'Fira Code', monospace" },
  { id: 'mangal', name: 'Mangal (Hindi System)', family: "'Mangal', 'Arial Unicode MS', sans-serif" },
  { id: 'krutidev', name: 'Kruti Dev 010 (Legacy)', family: '"Kruti Dev 010", "Krutidev", "KrutiDev010", sans-serif' },
  { id: 'noto_sans_dev', name: 'Noto Sans Devanagari', family: "'Noto Sans Devanagari', sans-serif" },
  { id: 'poppins', name: 'Poppins', family: "'Poppins', sans-serif" },
  { id: 'ubuntu', name: 'Ubuntu', family: "'Ubuntu', sans-serif" },
  { id: 'yatra_one', name: 'Yatra One', family: "'Yatra One', display" },
];

const SOUND_THEMES = ['typewriter', 'mechanical', 'bubble', 'arcade', 'laser', 'woodblock', 'soft_click', 'blue_switch', 'chime', 'thump'];

const BASE_DICTIONARIES = {
  english: `the be to of and a in that have I it for not on with he as you do at this but his by from they we say her she or an will my one all would there their what so up out if about who get which go me when make can like time no just him know take people into year your good some could them see other than then now look only come its over think also back after use two how our work first well way even new want because any these give day most us algorithm development infrastructure communication configuration application management organization professional responsibility technology architecture implementation understanding performance environment experience international significant particular individual philosophy psychological extraordinary unpredictable uncharacteristically comprehensive systematically as at be do go in is it me my no of on so to up we he an am time year work good make like home hand name read book tree bird fish star moon blue rain wind fire snow cold warm hot fast slow song word play jump knowledge beautiful experience necessary important technology government environment understand difference particular individual development comfortable information organization communication university relationship performance management international professional responsibility structure available community traditional vocabulary algorithm 'Hello!' It's self-esteem 100% #coding email@test.com $50.00 (brackets) 'quotes' user_name don't A&B v2.0 wow!!! [array] x/y=z left-right *pointer C++ www.site.com`.split(" "),
  hindi_mangal: `यह है और की में के लिए एक पर नहीं से को इस कि जो कर तो ही या रहा था वाले बाद जब तक अपने कुछ भी क्या गया हो सकता बहुत हुए ऐसा वह रहे बारे कैसे होने करने सरकार भारत विकास उपयोग समाज विज्ञान परिवार अधिकार महिला निर्माण समस्या व्यवस्था कार्यक्रम जानकारी माध्यम इसलिए प्रतिशत अंतर्राष्ट्रीय विश्वविद्यालय प्रासंगिकता औद्योगिकीकरण प्रतिस्पर्धात्मकता निम्नलिखित आवश्यकताएं पारिस्थितिकी महत्वाकांक्षी प्रकटीकरण अर्थव्यवस्थाओं प्रौद्योगिकी विशेषताओं संवेदनशीलता आत्मनिर्भरता विश्व वर्तमान पारिस्थितिकीय अवस्था अत्यंत चिंताजनक मानवीय हस्तक्षेप प्रकृति सूक्ष्म संतुलन झकझोर ग्लोबल-वार्मिंग हिमनदों पिघलना अनियंत्रित ऋतु-परिवर्तन संयोग दुष्कर्मों प्रतिफल वैज्ञानिकों कार्बन-उत्सर्जन नियंत्रित आगामी शताब्दियों पृथ्वी मरुस्थल आध्यात्मिक दृष्टिकोण रक्षिता वृक्षारोपण सतत-विकास पर्यावरण-हितैषी तकनीकों प्राथमिकता प्रतिबद्ध सजगता खुशहाली अब कब जब तब सब हल चल पल कल जल घर पर कर डर भर मत खत छत नल कमल काम नाम शाम किताब हिसाब पानी नानी कहानी दुकान मकान सुबह गुलाब फूल भूल सूरज केला मेला सवेरा पैसा कैसा मैदान मोर शोर कोयल कौआ पौधा मौसम भारत जीवन समय क्या क्यों अच्छा बच्चा सच्चा दिल्ली बिल्ली मुफ़्त ज्ञान विज्ञान श्रम विश्राम प्रबंध प्रगति प्रकृति राष्ट्र ट्रक धर्म कर्म आशीर्वाद विद्यार्थी विद्यालय उद्देश्य उज्ज्वल द्वंद्व श्रृंगार संस्कृति अंतर्राष्ट्रीय महत्व व्यक्तित्व 'नमस्ते!' क्या? हाँ। (कौशल) माता-पिता सुख-दुख 100% 'शाबाश' अरे! दिनांक: @ई-मेल 'जय-हिन्द!' (अ+ब)=स डॉ.कलाम प्रश्न? सत्यमेव वाह! बहुत-ख़ूब। टैग`.split(" "),
  hindi_krutidev: `gS vkSj dh esa ds fy, ,d ij ugha ls dks bl fd tks dj rks gh ;k jgk Fkk okys ckn tc rd vius dqN Hkh D;k x;k gks ldrk cgqr gq, ,slk og jgs ckjs dSls gksus djus ljdkj Hkkjr fodkl mi;ksx lekt foKku ifjokj vf/kdkj efgyk fuekZ.k leL;k O;oLFkk dk;ZØe tkudkjh ek/;e blfy, izfr'kr vUrjkZ"Vªh; fo'ofo|ky; dy ty ij dj py gy uy dey ued le; jru oru uxj exj pep xje uje ije vxy cxy dke uke jke 'kke nke fnu fiu fxy ihy uhy dqN rqe ewy Hkwy ns'k [ksy esy jsy lsc rSy eksj 'kksj pksj dkSvk ikS/kk dks;y ikuh ukuh nqdkx eSnku D;k D;ksa vPNk cPpk lPpk fnYyh fcYyh Kku foKku izca/k izxfr jk"Vª Vªd /keZ deZ vk'khZokn fo|kFkhZ fo|ky; mís'; mTtoy mUufr }a} Jaxkj laldfr egRo O;fDrRo jkT; LokLF; X;kjg eq¶r "Lokxr!" dSls\ ughaA (iz;kl) ysu-nsu lR;% 'mR—"V' lquks! le;% @laidZ ewY;@& "iqHk-ykHk!" (x+y)=z MkW-'kekZ mRrj! "fu"Bk" okg! vksg! vfr-lqanjA #fgUnh`.split(" "),
  python: `if in is or as and for def try set map int str sum len zip max min abs dir print class break float range while tuple slice yield return lambda import global assert except module object random append insert remove update format false true self args kwargs iter next init main exception ValueError TypeError ImportError asyncio decorator generator recursion staticmethod classmethod property collections itertools functools defaultdict numpy pandas requests dict repr enumerate filter zip_longest dict_keys dict_values dict_items NotImplemented str print("Hello!") func(x): [x:y:z] {'key':'val'} lambda:x*y name=="main" @property **kwargs list[a:b:c] f"Value:{x}" import_os try:pass class_App: x+=y self.name=name return_None arr.append(x) open('file.py') #coding=utf yield_from`.split(" "),
  javascript: `if do in of for let var map set get log new pop push DOM API CSS URL NaN this const block scope array slice shift class arrow yield async await throw catch break debug error false fetch index match alert event window prompt inner query width height style value function prototype undefined null export import default promise boolean closure console document element listener callback object module reduce filter string number symbol bigint strict typeof eval length math json date console.log("Hi!") x===y a!==b arr.map(x=>x) function(){} [a,b,c] {"key":"val"} document.querySelector() setTimeout(fn,ms) try{}catch(e) return; Math.floor() Array.isArray() Object.keys() JSON.parse() let_x=y; x.toString() {var} window.alert() preventDefault()`.split(" "),
  html: `html head body div span nav main form text link meta ul li ol img tr td th br hr class href style width title type name value table thead tbody tfoot align block color fonts frame audio video embed media param track source canvas header footer button select option article section details summary picture caption colgroup fieldset template noscript progress datalist textarea viewport property autoplay controls download disabled readonly required multiple tabindex datetime hreflang itemprop content charset enctype target <!DOCTYPE> Hello! href="#" src="img.jpg" class="btn" id="main" type="text"`.split(" "),
  css: `color background margin padding border display flex grid position width height top bottom left right font size weight family text align transform transition animation box shadow opacity z index hover focus active before after`.split(" "),
  sql: `SELECT FROM WHERE JOIN INNER LEFT RIGHT FULL ON GROUP BY ORDER HAVING ASC DESC INSERT INTO VALUES UPDATE as in is or on by to set top max min sum avg all any asc desc row key sql null drop view index select update insert delete create alter table where from group order having limit offset union join inner outer left right cross grant revoke commit date time char text year month varchar boolean numeric integer decimal primary foreign default unique cascade replace truncate coalesce extract substring partition window fetch trigger procedure function cursor declare database schema transaction selectfrom count() t1.id=t2.id 'value' a!=b (select) "name" sum(price) x>=y where_id=x inner_join group_by order_by insert_into values(x,y) update_db set_a=b like'%xyz%' --comment /text/`.split(" "),
  c: `if do for int char void long main FILE NULL argc argv case enum goto auto short float unsigned signed break struct union switch sizeof return double static extern size_t stdin stdout stderr printf scanf malloc calloc free realloc memset memcpy strlen strcpy strcmp strcat fopen fclose inline assert const include define pragma ifdef ifndef endif volatile register typedef ptrdiff_t fprintf sprintf snprintf fscanf sscanf getenv system abort exit atexit rand srand qsort bsearch clock_t time_t difftime strtol strtod perror #include<stdio.h> int_main(){ printf("Hi!"); return_x; if(x==y) while(true) struct_node* void_func(); x=(y+z); ptr=NULL; arr[x][y] sizeof(int) a->next=b; x++; //comment /text/ x!=y?a:b &variable; #define_MAX FILEfp;`.split(" "),
}; 

const PARAGRAPHS = [
  { id: 'wolf', lang: 'english', title: 'The Cunning Wolf', text: "It is an interesting story from the collection of Jataka Tales. Once upon a time, some people from a certain town went into a forest for an excursion. They want to enjoy the holiday to its fullest. They took baskets full of eatables with them. They ate all the meat they had brought with them till the noon time. They didn't leave anything for the dinner and suddenly realized that what they would eat in the dinner. They wanted to enjoy the vacation and without proper food, it was quite impossible. One of the men said, \"There is no need to worry. I will bring some fresh meat. We will make a fire here and roast it. It will be a great fun too\". After saying this, he took a club and went to the lake. He knew that the animals would definitely come to the riverside for drinking water. He lay down on the ground with a club in his hand and pretended as if, he was dead. After some time, a group of wolves came down to the lake. When they saw the man lying on the riverside, they kept an eye on him for some time. The King of the wolves said, \"I think, this man is playing trick on us. All of you stay here, while I will go and check whether he is really dead or pretending to be dead\". So, the cunning king of the wolves slithered up to the man and pulled his club a little cautiously. The man pulled back his club at once. The King of the wolves ran from the place and shouted, \"If you had been dead, you would not have pulled back you club when I tried to pull it. I caught your trick. You pretended to be dead so that you may kill one of us for your dinner\". The man quickly jumped up and tried to kill the wolf. He chucked his club at the King of the Wolves. Unfortunately, the man missed his aim and the wolf safely ran away. He looked for the other animals, but none of them was visible. All of them ran away. The man got frustrated at this, but could not do anything. Thus, he went back to his friends and said, \"I tried to get fresh meat by playing a trick on the animals, but the cunning wolf played a better trick on me. I am sorry. I could not get fresh meat for you\"." },
  { id: 'pollution', lang: 'english', title: 'Pollution', text: "Pollution is a word that is known by even kids nowadays. It has grown so prevalent that nearly everyone accepts the fact that pollution is increasing continuously. The name 'pollution' means the indication of any undesired foreign material in something. When we speak about pollution on our planet, we relate to the corruption that is occurring in natural supplies by multiple pollutants. All this is essentially caused by human actions that harm the environment in more than one way. Therefore, an imperative need has started to stop this issue straightaway. Pollution is destroying our earth rigorously and we need to understand its effects and counteract this damage. After discovering the harmful effects of pollution, one should perform the task of stopping or decreasing pollution as soon as possible. To overcome air pollution, people should start taking public transport such as buses, auto-rickshaws, pool-cabs to reduce pollution generated by vehicles. Try to avoid bursting crackers especially at the time of festivals which causes a huge amount of toxic pollution in the air. Avoiding crackers will also help to reduce noise pollution. Foremost is we must foster the habit of recycling. All the used plastic materials are been dumped in the oceans and land, which causes pollution. Therefore, we should not dispose of such toxic materials off after use, instead, reuse them as long as you can. We must also inspire everyone to plant more trees that will absorb the harmful gases and make the air disinfectant. While talking on a higher level, the government must restrict the usage of fertilizers to control the soil's fertility. Also, industries must be forbidden from discharging their waste into oceans and rivers, causing water pollution. Collectively, all types of pollution are dangerous and come with grave outcomes. Everyone must step towards development ranging from individuals to the industries. As dealing with this problem calls for a collective effort, so we must unite and work for it. Furthermore, the lives of innocent animals are being lost because of such human actions. So, all of us must come and together and take a stand to become a voice for the unheard and making this earth pollution-free." },
  { id: 'covid', lang: 'english', title: 'COVID-19', text: "On February 7, the virus could have spread from an infected animal to humans said by Chinese researchers and through illegally trafficked pangolins, prized in Asia for medicine and food. Scientists have pointed to either snakes or bats as possible sources. The World Health Organization declared the COVID a pandemic on March 11. It said it was \"deeply concerned by the alarming levels of severity and spread\". The new corona-virus outbreak, which originated in Wuhan, China, to be a pandemic by The World Health Organization (WHO). As of September 20, amid more than 30.8 million cases, the global death toll surpassed 957,000. According to the data collected, over 21 million people have recovered from the disease worldwide. According to the World Health Organization, ranging from the common cold caused the coronavirus family illness and more severe diseases such as SARS-severe acute respiratory syndrome and the MERS- Middle East respiratory syndrome. The virus circulates in animals, and some can be transmitted between humans and animals. Several coronaviruses are circulating in various animals that have not infected humans. The new coronavirus has been named COVID-19 and the seventh known to affect humans. Fever, breathing difficulties and coughing are some of the common signs of infection. In severe cases, it can cause death or fatal damage like pneumonia and multiple organ failure. Between one and fourteen days is the incubation period of COVID-19. It is very contagious before symptoms appear, which is why so many people get infected. Infected patients can also be asymptomatic, meaning they do not display any symptoms despite having the virus in their systems. China actually alerted the World Health Organization to unusual pneumonia cases in Wuhan's city on December 31. COVID-19 virus is thought to have originated where wildlife was sold illegally, in a seafood market. On February 7, the virus could have spread from an infected animal to humans said by Chinese researchers and through illegally trafficked pangolins, prized in Asia for medicine and food. Scientists have pointed to either snakes or bats as possible sources. A collective social observance of each individual measures is equally as important as those measures themselves, for protection against the disease. It is critical for containing and controlling the disease's spread to treat diagnosed cases and isolation of those who had contact with sick persons or infected. Those who had contact with diagnosed cases, it is recommended to isolate them. Until the test results and detail information of the suspect case are available, those who had close contact with a certain suspect case need to be isolated. Even if the test results are negative for the suspect, isolation is needed as a precaution. At least 14 days, should be the isolation period due to the virus incubation period. It is through contact tracing efforts that the persons they contacted are identified and their patients. The morbidity increases during the pandemic, and through contact tracing and isolation can be controlled. This enables efficient use of the available health personnel capacities and healthcare institutions that can combat the pandemic with proper precaution, thereby preventing a halt and overburdening of the country's healthcare system. Therefore, we all need to act responsibly and support this goal together or as individual members of society. The World Health Organization declared the COVID a pandemic on March 11. It said it was \"deeply concerned by the alarming levels of severity and spread\" of the outbreak and recommends basic hygiene such as with your elbow covering your mouth when coughing or sneezing and regularly washing hands with soap and water." },
  { id: 'career', lang: 'english', title: 'Career Goals', text: "A person's choice of career is solely based on motivations, aspirations, and impulses. Whatever the person plans to do in life must be driven by passion and determination. Choosing the right career is very important as it determines the level of self-development and working spree. Setting a career goal helps to fulfill one's dream to become something in life. This is dependent on a person's values, beliefs, interests, qualifications, and personal life experiences. A person gets a proper direction in life, and he/she tries to accomplish the milestones and reach the target. Mostly, people set their career goals in the early years of life. This enables them to have a proper mindset and vision to think ahead in life. All their activities are often related to achieving the main goal. They must overcome the upcoming challenges and have a strong determination to look forward to the bigger picture. One must avoid the negativities coming in their way. A person may have long-term and short-term career goals. Long-term career goals are the future achievements for which a person has been striving. Short-term career goals are supportive and actionable goals, which are the minor steps to achieve long-term goals. Short-term career goals may include being knowledgeable enough about the steps of achieving long-term goals. Educational qualifications and required pieces of training are major objectives. A good experience and development of associated skills related to the long-term goal are basic requirements. Career goals can be focused on productivity, which means a person can produce or meet the desired ends. Efficiency could also be a goal that includes speed, accuracy, and consistency for producing the desired results. Having a career goal within academics always helps one's self-development within the chosen career. Improving skills and looking for opportunities help to keep a person relevant in a particular field. In the long run, having a personal development goal is equally important as one's educational qualifications. Personal skills like communication, teamwork, leadership qualities, etc., help in the long and short-run processes. Career goals should be practical and achievable. A person must dream big, but he needs to be aware of his abilities. There is a difference between a person's desire to become something in life and what he is good at. Career goals must be chosen considering a combination of these two. Career goals must be flexible, and one should not stick to only one option. A person must always have a backup plan. In terms of setting career goals, one must have alternate plans. But it does not mean he has to do something which he is not interested in or something which he is not capable of achieving. Career goals must also be financially driven. For example, having a career goal to be a company's managing director must also include the benefits of financial gains. Apart from achieving the desired post or designation, career goals include job satisfaction and a work-life balance. In terms of achieving academic career goals, it should include a person's overall growth and a thorough knowledge of one's field." },
  { id: 'haar_kruti', lang: 'hindi_krutidev', title: 'हार की जीत (Krutidev)', text: "ek¡ dks vius csVs vkSj fdlku dks vius ygygkrs [ksr ns[kdj tks vkuan vkrk gS] ogh vkuan ckck Hkkjrh dks viuk ?kksM+k ns[kdj vkrk FkkA Hkxon~&Hktu ls tks le; cprk] og ?kksM+s dks viZ.k gks tkrkA og ?kksM+k cM+k lqanj Fkk] cM+k cyokuA mlds tksM+ dk ?kksM+k lkjs bykds esa u FkkA ckck Hkkjrh mls ^lqYrku* dg dj iqdkjrs] vius gkFk ls [kjgjk djrs] [kqn nkuk f[kykrs vkSj ns[k&ns[kdj çlUu gksrs FksA mUgksaus :i;k] eky] vlckc] tehu vkfn viuk lc&dqN NksM+ fn;k Fkk] ;gk¡ rd fd mUgsa uxj ds thou ls Hkh ?k`.kk FkhA vc xk¡o ls ckgj ,d NksVs&ls efUnj esa jgrs vkSj Hkxoku dk Hktu djrs FksA ^^eSa lqyrku ds fcuk ugha jg ldw¡xk** mUgsa ,slh HkzkfUr lh gks xbZ FkhA os mldh pky ij yêw FksA dgrs] ^^,sls pyrk gS tSls eksj ?kVk dks ns[kdj ukp jgk gksA** tc rd la/;k le; lqyrku ij p<+dj vkB&nl ehy dk pDdj u yxk ysrs] mUgsa pkSu u vkrkA [kM+xflag ml bykds dk çfl) Mkdw FkkA yksx mldk uke lqudj dk¡irs FksA gksrs&gksrs lqYrku dh dhfrZ mlds dkuksa rd Hkh igq¡phA mldk ân; mls ns[kus ds fy, v/khj gks mBkA og ,d fnu nksigj ds le; ckck Hkkjrh ds ikl igq¡pk vkSj ueLdkj djds cSB x;kA ckck Hkkjrh us iwNk] ^^[kMxflag] D;k gky gS\\** [kMxflag us flj >qdkdj mÙkj fn;k] ^^vkidh n;k gSA** ^^mldh pky rqEgkjk eu eksg ysxh!** dgrs gSa ns[kus esa Hkh cgqr lq¡nj gSA ^^D;k dguk! tks mls ,d ckj ns[k ysrk gS] mlds ân; ij mldh Nfo vafdr gks tkrh gSA** ^^cgqr fnuksa ls vfHkyk\"kk Fkh] vkt mifLFkr gks ldk gw¡A** ckck Hkkjrh vkSj [kM+xflag vLrcy esa igq¡psA ckck us ?kksM+k fn[kk;k ?keaM ls] [kM+xflag us ns[kk vk'p;Z lsA mlus lSadM+ks ?kksM+s ns[ks Fks] ijUrq ,slk ck¡dk ?kksM+k mldh vk¡[kksa ls dHkh u xqtjk FkkA lkspus yxk] HkkX; dh ckr gSA ,slk ?kksM+k [kM+xflag ds ikl gksuk pkfg, FkkA bl lk/kq dks ,slh phtksa ls D;k ykHk\\ dqN nsj rd vk'p;Z ls pqipki [kM+k jgkA blds i'pkr~ mlds ân; esa gypy gksus yxhA ckydksa dh&lh v/khjrk ls cksyk] ^^ijarq ckckth] bldh pky u ns[kh rks D;k\\** nwljs ds eq[k ls lquus ds fy, mudk ân; v/khj gks x;kA ?kksM+s dks [kksydj ckgj x,A ?kksM+k ok;q&osx ls mMus yxkA mldh pky dks ns[kdj [kM+xflag ds ân; ij lk¡i yksV x;kA og Mkdw Fkk vkSj tks oLrq mls ilan vk tk, ml ij og viuk vf/kdkj le>rk FkkA mlds ikl ckgqcy Fkk vkSj vkneh HkhA tkrs&tkrs mlus dgk] ^^ckckth] eSa ;g ?kksM+k vkids ikl u jgus nw¡xkA** ckck Hkkjrh Mj x,A vc mUgsa jkr dks uhan u vkrhA lkjh jkr vLrcy dh j[kokyh esa dVus yxhA çfr {k.k [kM+xflag dk Hk; yxk jgrk] ijarq dbZ ekl chr x, vkSj og u vk;kA ;gk¡ rd fd ckck Hkkjrh dqN vlko/kku gks x, vkSj bl Hk; dks LoIu ds Hk; dh ukbZa feF;k le>us yxsA la/;k dk le; FkkA ckck Hkkjrh lqYrku dh ihB ij lokj gksdj ?kweus tk jgs FksA bl le; mudh vk¡[kksa esa ped Fkh] eq[k ij çlUurkA dHkh ?kksM+s ds 'kjhj dks ns[krs] dHkh mlds jax dks vkSj eu esa Qwys u lekrs FksA lglk ,d vksj ls vkokt vkbZ] ^^vks ckck] bl daxys dh lqurs tkukA** vkokt esa d:.kk FkhA ckck us ?kksM+s dks jksd fy;kA ns[kk] ,d vikfgt o`{k dh Nk;k esa iM+k djkg jgk gSA cksys] ^^D;ksa rqEgsa D;k d\"V gS\\** vikfgt us gkFk tksM+dj dgk] ^^ckck] eSa nqf[k;kjk gw¡A eq> ij n;k djksA jkekokyk ;gk¡ ls rhu ehy gS] eq>s ogk¡ tkuk gSA ?kksM+s ij p<+k yks] ijekRek Hkyk djsxkA** ^^ogk¡ rqEgkjk dkSu gS\\** ^^nqxknZÙk oS| dk uke vkius lquk gksxkA eSa mudk lkSrsyk HkkbZ gw¡A** ckck Hkkjrh us ?kksM+s ls mrjdj vikfgt dks ?kksM+s ij lokj fd;k vkSj Lo;a mldh yxke idM+dj /khjs&/khjs pyus yxsA lglk mUgsa ,d >Vdk&lk yxk vkSj yxke gkFk ls NwV xbZA muds vk'p;Z dk fBdkuk u jgk] tc mUgksaus ns[kk fd vikfgt ?kksM+s dh ihB ij rudj cSBk gS vkSj ?kksM+s dks nkSM+k, fy, tk jgk gSA muds eq[k ls Hk;] foLe; vkSj fujk'kk ls feyh gqbZ ph[k fudy xbZA og vikfgt Mkdw [kM+xflag FkkAckck Hkkjrh dqN nsj rd pqi jgs vkSj dqN le; i'pkr~ dqN fu'p; djds iwjs cy ls fpYykdj cksys] ^^tjk Bgj tkvksA** [kM+xflag us ;g vkokt lqudj ?kksM+k jksd fy;k vkSj mldh xjnu ij I;kj ls gkFk Qsjrs gq, dgk] ^^ckckth] ;g ?kksM+k vc u nw¡xkA** ^^ijarq ,d ckr lqurs tkvksA** [kM+xflag Bgj x;kA ckck Hkkjrh us fudV tkdj mldh vksj ,slh vk¡[kksa ls ns[kk tSls cdjk dlkbZ dh vksj ns[krk gS vkSj dgk] ^^;g ?kksM+k rqEgkjk gks pqdk gSA eSa rqels bls okil djus ds fy, u dgw¡xkA ijarq [kM+xflag] dsoy ,d çkFkZuk djrk gw¡A bls vLohdkj u djuk] ugha rks esjk fny VwV tk,xkA** ^^ckckth] vkKk dhft,A eSa vkidk nkl gw¡] dsoy ?kksM+k u nw¡xkA** ^^vc ?kksM+s dk uke u yksA eSa rqels bl fo\"k; esa dqN u dgw¡xkA esjh çkFkZuk dsoy ;g gS fd bl ?kVuk dks fdlh ds lkeus çdV u djukA** [kM+xflag dk eq¡g vk'p;Z ls [kqyk jg x;kA mldk fopkj Fkk fd mls ?kksM+s dks ysdj ;gk¡ ls Hkkxuk iM+sxk] ijarq ckck Hkkjrh us Lo;a mls dgk fd bl ?kVuk dks fdlh ds lkeus çdV u djukA blls D;k ç;kstu fl) gks ldrk gS\\ [kM+xflag us cgqr lkspk] cgqr flj ekjk] ijarq dqN le> u ldkA gkjdj mlus viuh vk¡[ksa ckck Hkkjrh ds eq[k ij xM+k nha vkSj iwNk] ^^ckckth blesa vkidks D;k Mj gS\\** lqudj ckck Hkkjrh us mÙkj fn;k] ^^yksxksa dks ;fn bl ?kVuk dk irk pyk rks os nhu&nqf[k;ksa ij fo'okl u djsaxsA** ;g dgrs&dgrs mUgksaus lqYrku dh vksj ls bl rjg eq¡g eksM+ fy;k tSls mudk mlls dHkh dksbZ laca/k gh ugha jgk gksA ckck Hkkjrh pys x,A ijarq muds 'kCn [kM+xflag ds dkuksa esa mlh çdkj xw¡t jgs FksA lksprk Fkk] dSls Å¡ps fopkj gSa] dSlk ifo= Hkko gS! mUgsa bl ?kksM+s ls çse Fkk] bls ns[kdj mudk eq[k Qwy dh ukbZa f[ky tkrk FkkA dgrs Fks] ^^blds fcuk eSa jg u ldw¡xkA** bldh j[kokyh esa os dbZ jkr lks, ughaA Hktu&Hkfä u dj j[kokyh djrs jgsA ijarq vkt muds eq[k ij nq[k dh js[kk rd fn[kkbZ u iM+rh FkhA mUgsa dsoy ;g [;ky Fkk fd dgha yksx nhu&nqf[k;ksa ij fo'okl djuk u NksM+ nsA ,slk euq\";] euq\"; ugha nsork gSA jkf= ds va/kdkj esa [kM+xflag ckck Hkkjrh ds eafnj igq¡pkA pkjksa vksj lUukVk FkkA vkdk'k esa rkjs fVefVek jgs FksA FkksM+h nwj ij xk¡oksa ds dqÙks HkkSad jgs FksA eafnj ds vanj dksbZ 'kCn lqukbZ u nsrk FkkA [kM+xflag lqYrku dh ckx idM+s gq, FkkA og /khjs&/khjs vLrcy ds QkVd ij igq¡pkA QkVd [kqyk iM+k FkkA fdlh le; ogk¡ ckck Hkkjrh Lo;a ykBh ysdj igjk nsrs Fks] ijarq vkt mUgsa fdlh pksjh] fdlh Mkds dk Hk; u FkkA [kM+xflag us vkxs c<+dj lqyrku dks mlds LFkku ij ck¡/k fn;k vkSj ckgj fudydj lko/kkuh ls QkVd can dj fn;kA bl le; mldh vk¡[kksa esa usdh ds vk¡lw FksA jkf= dk rhljk igj chr pqdk FkkA pkSFkk igj vkjaHk gksrs gh ckck Hkkjrh us viuh dqfV;k ls ckgj fudy BaMs ty ls Luku fd;kA mlds i'pkRk bl çdkj tSls dksbZ LoIu esa py jgk gks] muds ik¡o vLrcy dh vksj c<+sA ijarq QkVd ij igq¡pdj mudks viuh Hkwy çrhr gqbZA lkFk gh ?kksj fujk'kk us ik¡o dks eu&eu Hkj dk Hkkjh cuk fn;kA os ogha :d x,A ?kksM+s us vius Lokeh ds ik¡oksa dh pki dks igpku fy;k vkSj tksj ls fgufguk;kA vc ckck Hkkjrh vk'p;Z vkSj çlUurk ls nkSM+rs gq, vanj ?kqls vkSj vius I;kjs ?kksM+s ds xys ls fyiVdj bl çdkj jksus yxs ekuks dksbZ firk cgqr fnu ls fcNM+s gq, iq= ls fey jgk gksA ckj&ckj mldh ihBij gkFk Qsjrs] ckj&ckj mlds eq¡g ij Fkifd;k¡ nsrsA fQj os larks\"k ls cksys] ^^vc dksbZ nhu&nqf[k;ksa ls eq¡g u eksM+sxkA**" },
  { id: 'hanuman_kruti', lang: 'hindi_krutidev', title: 'हनुमान जयंती (Krutidev)', text: "guqeku t;arh ,d fgUnw R;kSgkj gS tks Hkkjr vkSj usiky esa euk;k tkrk gSA ;g R;kSgkj Hkxoku guqeku ds tUe volj ij euk;k tkrk gS tks Hkkjr vkSj usiky ds ,d yksdfç; fgUnw nsork gSaA LFkku ds vuqlkj jhrh&fjokt cny ldrs gSa ysfdu 'kfä vkSj lkgl ds nsork guqeku th dk vk'khokZn ekaxuk lHkh ds fy, ,d cjkcj gSA Hkxoku guqeku ,d ifo= vkSj lcls lEekfur Hkxoku gSa] ftuds eafnj vkerkSj ij jk\"Vª ds gj NksVh cM+h txgksa ij ik, tkrs gSaA guqeku t;arh ,d t'u dk volj gS tc lHkh yksx Hkxoku guqeku ds tUe dk t'u eukrs gSaA Hkxoku guqeku vius dkS'ky vkSj cqf) ds fy, tkus tkrs gSaA mUgksaus vdsys gh iwjs yadk dks tyk fn;k vkSj ;gka rd ​​fd egk'kfä'kkyh jko.k Hkh mUgsa ugha jksd ik;kA og 'kfä'kkyh gksus ds lkFk gh 'kkar vkSj lkSE; Hkh gSA /kkfeZd xzaFkksa vkSj guqeku pkyhlk esa] ;g fo'ks\"k :i ls mYys[k fd;k x;k gS fd guqeku vius iwtd dks 'kkS;Z] lkgl vkSj thou 'kfä çnku djrs gSA og vius Hkäksa ds thou esa vkus okyh ck/kkvksa dks nwj djrs gS vkSj [kq'kh rFkk larks\"k ykrs gSA mu yksxksa ds fy, tks vius jkstejkZ ds thou esa dkQh O;Lr gSa jgrs gSa vkSj gj jkst guqeku th dh iwtk ugh dj ikrs; muds fy,  guqeku t;arh ,d csgrj volj gS rkfd vius lkjh xyfr;ksa dh ekQh ekaxdj mudk vk'khokZn çkIr dj ldsaA guqeku t;arh vk/;kfRed :i ls Hkxoku guqeku ls tqM+us vkSj muds xq.kksa dks ;kn djus dk ,d volj gSA vikj rkdr gksus ds ckotwn] og ,d unh dh rjg 'kkar FksA mUgsa vius dkS'ky ij dHkh dksbZ xoZ ugha jgk gS vkSj bldk mi;ksx oks dsoy nwljksa ds fgr ds fy, djrs gSA ;g R;ksgkj gesa Lo;a dks Hkxoku guqeku ds :i esa vk/;kfRed vkSj ekufld :i ls fodflr gksuk fl[kkrk gSA ;g gesa Hkxoku guqeku ij iwjk Hkjkslk cuk;s j[krs gq, dfBu ifjfLFkfr;ksa esa /k;Z vkSj 'kkarfpÙk jguk fl[kkrk gS vkSj blls ckgj fudyus dh ;kstuk cukuk Hkh fl[kkrk gSA guqeku t;arh ,d çeq[k R;ksgkj gS tks vukfn dky ls euk;k tk jgk gS vkSj vuar dky rd euk;k tk,xkA og ,sls Hkxoku gSa ftues T;knk ls T;knk yksxksa dh J)k gS vkSj gj fnu vjcksa Hkäksa }kjk mudh iwtk dh tkrh gSA mudh yksdfç;rk dk vanktk blls gh yxk;k tk ldrk gS fd Hkkjr ds reke dLcksa vkSj xkaoksa esa Hkxoku guqeku dk eafnj <wa<uk ,d vke ckr gSA nf{k.k Hkkjr ds dbZ jkT; guqeku t;arh dks guqeku o/kZfUr ds :i esa eukrs gSaA ,slk blfy, gS D;ksafd mudk ekuuk ​​gS fd t;arh fdlh ,sls O;fä ds fy, eukbZ tkrh gS tks vc thfor ugha gSA fojks/kkHkklh rkSj ij] Hkxoku guqeku vej gSa vkSj vHkh Hkh ,slk ekuk tkrk gS fd os bl xzg ij jgrs gSa] blfy, mudh t;arh eukuk U;k;laxr ugha gSA blfy, os muds tUe dks guqeku o/kZfUr ds :i esa eukrs gSaA Hkxoku guqeku ds tUe dks ysdj tks vkLFkk gS oks eq[; :i ls nks vo/kkj.kkvksa ij foHkkftr gSaA /kkfeZd rifLo;ksa ds ,d lewg dk ekuuk​​ gS fd Hkxoku guqeku dk tUe fganw dSysaMj ds vuqlkj pkS= eghus esa iwf.kZek ds fnu gqvk FkkA blfy, os bl fnu dks guqeku t;arh ds :i esa eukrs gSaA rfeyukMq tSls nf{k.k Hkkjr ds jkT; esa guqeku t;arh muds okLrfod tUe ds fnu ugha cfYd ml fnu eukbZ tkrh gS] ftl fnu guqeku th] Hkxoku jke ls feys FksA guqeku t;arh ds jLe fjokt Hkh dbZ vU; fganw R;ksgkjksa dh rjg gh 'kqHk vkSj vk/;kfRed gksrs gSaA ctjaxcyh dh t;arh eukus ds lHkh jLe fjokt Hkksj ls 'kq: gks tkrs gS D;ksfd blh nkSjku mudk tUe gqvk FkkA lHkh Hkä lqcg tYnh ugkrs gSa vkSj lqcg lcls igys guqeku th dh iwtk djrs gSaA bl fnu os 'kjkc ihus] /kweziku djus vkSj ekalkgkjh Hkkstu djus ls ijgst djrs gSaA Hkä iwjs fnu miokl j[krs gSa vkSj viuk vf/kdka'k le; guqeku th dh iwtk esa O;rhr djrs gSaA guqeku pkyhlk] tks Hkxoku guqeku dk Hkfäe; Hktu gS] vkSj ges'kk ls lcls vf/kd i<+s tkus okys fganw /kkfeZd xzaFkksa esa ls ,d gS mldk ikB fd;k tkrk gSA Hkxoku guqeku dh ewfrZ;ksa dks flanwj ls ltk;k tkrk gS vkSj mUgsa u, oL=ksa rFkk ekykvksa ls ltk;k Hkh tkrk gSA bl nkSjku cM+h la[;k esa Hkä Hkh guqeku eafnjksa esa vkrs gSaA ifjokjksa dks vius lcls fç; Hkxoku dh iwtk djus ds fy, eafnjksa dh vksj tkrs ns[kk tk ldrk gSA" },
  { id: 'haar_mangal', lang: 'hindi_mangal', title: 'हार की जीत (Mangal)', text: "माँ को अपने बेटे और किसान को अपने लहलहाते खेत देखकर जो आनंद आता है, वही आनंद बाबा भारती को अपना घोड़ा देखकर आता था। भगवद्-भजन से जो समय बचता, वह घोड़े को अर्पण हो जाता। वह घोड़ा बड़ा सुंदर था, बड़ा बलवान। उसके जोड़ का घोड़ा सारे इलाके में न था। बाबा भारती उसे सुल्तान कह कर पुकारते, अपने हाथ से खरहरा करते, खुद दाना खिलाते और देख-देखकर प्रसन्न होते थे।" },
  { id: 'hanuman_mangal', lang: 'hindi_mangal', title: 'हनुमान जयंती (Mangal)', text: "हनुमान जयंती एक हिन्दू त्यौहार है जो भारत और नेपाल में मनाया जाता है। यह त्यौहार भगवान हनुमान के जन्म अवसर पर मनाया जाता है जो भारत और नेपाल के एक लोकप्रिय हिन्दू देवता हैं। स्थान के अनुसार रीति-रिवाज बदल सकते हैं लेकिन शक्ति और साहस के देवता हनुमान जी का आशीर्वाद मांगना सभी के लिए एक बराबर है।" },
  { id: 'python1', lang: 'python', title: 'Python: Functions & Loops', text: "def calculate_sum(a, b):\n    result = a + b\n    return result\n\nprint(calculate_sum(5, 10))\nfor i in range(5):\n    print(i)" },
  { id: 'js1', lang: 'javascript', title: 'JavaScript: Async Fetch', text: "const fetchData = async () => {\n  try {\n    const res = await fetch(url);\n    const data = await res.json();\n  } catch (err) {\n    console.error(err);\n  }\n};" },
  { id: 'html1', lang: 'html', title: 'HTML: Basic Skeleton', text: "<!DOCTYPE html>\n<html>\n<head>\n  <title>Page</title>\n</head>\n<body>\n  <h1>Hello World</h1>\n</body>\n</html>" },
  { id: 'css1', lang: 'css', title: 'CSS: Flexbox Styling', text: "body {\n  margin: 0;\n  padding: 0;\n  background-color: #333;\n  color: white;\n}\n.container {\n  display: flex;\n  justify-content: center;\n}" },
  { id: 'sql1', lang: 'sql', title: 'SQL: Select & Join', text: "SELECT e.first_name, e.last_name, d.department_name\nFROM employees e\nINNER JOIN departments d ON e.dept_id = d.id\nWHERE e.salary > 50000\nORDER BY e.last_name ASC;" },
  { id: 'c1', lang: 'c', title: 'C: Pointers & Structs', text: "#include <stdio.h>\n\nvoid swap(int *a, int *b) {\n    int temp = *a;\n    *a = *b;\n    *b = temp;\n}\n\nint main() {\n    int x = 10, y = 20;\n    swap(&x, &y);\n    return 0;\n}" }
];

const ALL_LANGUAGES = [];
Object.keys(BASE_DICTIONARIES).forEach(lang => {
  [1, 2, 3, 4].forEach(level => { ALL_LANGUAGES.push(`${lang}_${level}.0`); });
});

const KEYBOARD_LAYOUT = [
  [
    { code: 'Backquote', en: '`', enShift: '~', hi: 'ृ', hiShift: 'ऋ' }, { code: 'Digit1', en: '1', enShift: '!', hi: '१', hiShift: 'ऍ' }, { code: 'Digit2', en: '2', enShift: '@', hi: '२', hiShift: 'ॅ' }, { code: 'Digit3', en: '3', enShift: '#', hi: '३', hiShift: 'र्' }, { code: 'Digit4', en: '4', enShift: '$', hi: '४', hiShift: 'र्' }, { code: 'Digit5', en: '5', enShift: '%', hi: '५', hiShift: 'ज्ञ' }, { code: 'Digit6', en: '6', enShift: '^', hi: '६', hiShift: 'त्र' }, { code: 'Digit7', en: '7', enShift: '&', hi: '७', hiShift: 'क्ष' }, { code: 'Digit8', en: '8', enShift: '*', hi: '८', hiShift: 'श्र' }, { code: 'Digit9', en: '9', enShift: '(', hi: '९', hiShift: '(' }, { code: 'Digit0', en: '0', enShift: ')', hi: '०', hiShift: ')' }, { code: 'Minus', en: '-', enShift: '_', hi: '-', hiShift: 'ः' }, { code: 'Equal', en: '=', enShift: '+', hi: 'ृ', hiShift: 'ऋ' }, { code: 'Backspace', display: 'Backspace', isSpecial: true, width: 'w-16 sm:w-24 text-[10px] sm:text-sm' }
  ],
  [
    { code: 'Tab', display: 'Tab', isSpecial: true, width: 'w-12 sm:w-16 text-xs' }, { code: 'KeyQ', en: 'q', enShift: 'Q', hi: 'ौ', hiShift: 'औ' }, { code: 'KeyW', en: 'w', enShift: 'W', hi: 'ै', hiShift: 'ऐ' }, { code: 'KeyE', en: 'e', enShift: 'E', hi: 'ा', hiShift: 'आ' }, { code: 'KeyR', en: 'r', enShift: 'R', hi: 'ी', hiShift: 'ई' }, { code: 'KeyT', en: 't', enShift: 'T', hi: 'ू', hiShift: 'ऊ' }, { code: 'KeyY', en: 'y', enShift: 'Y', hi: 'ब', hiShift: 'भ' }, { code: 'KeyU', en: 'u', enShift: 'U', hi: 'ह', hiShift: 'ङ' }, { code: 'KeyI', en: 'i', enShift: 'I', hi: 'ग', hiShift: 'घ' }, { code: 'KeyO', en: 'o', enShift: 'O', hi: 'द', hiShift: 'ध' }, { code: 'KeyP', en: 'p', enShift: 'P', hi: 'ज', hiShift: 'झ' }, { code: 'BracketLeft', en: '[', enShift: '{', hi: 'ड', hiShift: 'ढ' }, { code: 'BracketRight', en: ']', enShift: '}', hi: '़', hiShift: 'ञ' }, { code: 'Backslash', en: '\\', enShift: '|', hi: 'ॉ', hiShift: 'ऑ' }
  ],
  [
    { code: 'CapsLock', display: 'Caps', isSpecial: true, width: 'w-16 sm:w-20 text-xs' }, { code: 'KeyA', en: 'a', enShift: 'A', hi: 'ो', hiShift: 'ओ' }, { code: 'KeyS', en: 's', enShift: 'S', hi: 'े', hiShift: 'ए' }, { code: 'KeyD', en: 'd', enShift: 'D', hi: '्', hiShift: 'अ' }, { code: 'KeyF', en: 'f', enShift: 'F', hi: 'ि', hiShift: 'इ' }, { code: 'KeyG', en: 'g', enShift: 'G', hi: 'ु', hiShift: 'उ' }, { code: 'KeyH', en: 'h', enShift: 'H', hi: 'प', hiShift: 'फ' }, { code: 'KeyJ', en: 'j', enShift: 'J', hi: 'र', hiShift: 'ऱ' }, { code: 'KeyK', en: 'k', enShift: 'K', hi: 'क', hiShift: 'ख' }, { code: 'KeyL', en: 'l', enShift: 'L', hi: 'त', hiShift: 'थ' }, { code: 'Semicolon', en: ';', enShift: ':', hi: 'च', hiShift: 'छ' }, { code: 'Quote', en: "'", enShift: '"', hi: 'ट', hiShift: 'ठ' }, { code: 'Enter', display: 'Enter', isSpecial: true, width: 'w-16 sm:w-24 text-xs' }
  ],
  [
    { code: 'ShiftLeft', display: 'Shift', isSpecial: true, width: 'w-20 sm:w-28 text-xs' }, { code: 'KeyZ', en: 'z', enShift: 'Z', hi: 'े', hiShift: 'ऑ' }, { code: 'KeyX', en: 'x', enShift: 'X', hi: 'ं', hiShift: 'ँ' }, { code: 'KeyC', en: 'c', enShift: 'C', hi: 'म', hiShift: 'ण' }, { code: 'KeyV', en: 'v', enShift: 'V', hi: 'न', hiShift: 'ऩ' }, { code: 'KeyB', en: 'b', enShift: 'B', hi: 'व', hiShift: 'व' }, { code: 'KeyN', en: 'n', enShift: 'N', hi: 'ल', hiShift: 'ळ' }, { code: 'KeyM', en: 'm', enShift: 'M', hi: 'स', hiShift: 'श' }, { code: 'Comma', en: ',', enShift: '<', hi: ',', hiShift: 'ष' }, { code: 'Period', en: '.', enShift: '>', hi: '.', hiShift: '।' }, { code: 'Slash', en: '/', enShift: '?', hi: 'य', hiShift: 'य' }, { code: 'ShiftRight', display: 'Shift', isSpecial: true, width: 'w-20 sm:w-28 text-xs' }
  ]
];

// ==========================================
// 2. CURRICULUM & ENGINE LOGIC
// ==========================================

const LEARNING_PHASES = {
  english: [
    { name: "L1: Home Row (F J)", chars: "fj" }, { name: "L2: Home Row (D K)", chars: "fjdk" }, { name: "L3: Home Row (S L)", chars: "fjdksl" }, { name: "L4: Home Row (A ;)", chars: "fjdksla;" }, { name: "L5: Full Home Row", chars: "asdfjkl;gh" },
    { name: "L6: Top Row (R U)", chars: "ru" }, { name: "L7: Top Row (E I)", chars: "reui" }, { name: "L8: Top Row (W O)", chars: "rewuio" }, { name: "L9: Top Row (Q P)", chars: "qweruiop" }, { name: "L10: Full Top Row", chars: "qwertyuiop" },
    { name: "L11: Word Practice 1", dict: true }, { name: "L12: Word Practice 2", dict: true }, { name: "L13: Word Practice 3", dict: true }, { name: "L14: Sentence Practice 1", dict: true }, { name: "L15: Mastery Test", dict: true }
  ],
  hindi: [
    { name: "L1: मध्य पंक्ति (क, र, त, ट, प, च)", words: ["क", "र", "त", "ट", "प", "च", "कर", "तक", "पट", "चट", "पर", "चर", "तट", "कच"] },
    { name: "L2: मात्राएं (ि, ु)", words: ["कि", "रु", "ति", "टु", "पि", "चु", "कित", "चुप", "पिन", "रुक", "टिक", "पिट"] },
    { name: "L3: मात्राएं (ो, े)", words: ["को", "रो", "तो", "पो", "के", "रे", "ते", "पे", "कोट", "रोप", "तेर", "पेट"] },
    { name: "L4: ऊपरी पंक्ति (ब, ह, ग, द, ज, ड)", words: ["ब", "ह", "ग", "द", "ज", "ड", "बग", "हद", "गज", "जग", "जब", "डर", "हर", "दर"] },
    { name: "L5: ऊपरी मात्राएं (ौ, ै, ा, ी, ू)", words: ["कौ", "कै", "का", "की", "कू", "गौ", "गै", "गा", "गी", "गू", "तौ", "तै", "ता", "ती", "तू"] },
    { name: "L6: अभ्यास (मध्य + ऊपरी)", words: ["काम", "राम", "नाम", "दाम", "हरा", "भरा", "जाग", "भाग", "राग", "ताग", "बात", "रात"] },
    { name: "L7: निचली पंक्ति (म, न, व, ल, स, य)", words: ["म", "न", "व", "ल", "स", "य", "मन", "नम", "वन", "नव", "लम", "सम", "नस", "रस", "बस", "यस"] },
    { name: "L8: अभ्यास (सभी पंक्तियां)", words: ["समय", "लगन", "मदन", "पवन", "नगर", "मगर", "डगर", "नमक", "चमक", "दमक"] },
    { name: "L9: शिफ्ट (मध्य पंक्ति)", words: ["ओ", "ए", "अ", "इ", "उ", "फ", "ख", "थ", "छ", "ठ", "फल", "खग", "रथ", "छत", "ठग"] },
    { name: "L10: शिफ्ट (ऊपरी पंक्ति)", words: ["औ", "ऐ", "आ", "ई", "ऊ", "भ", "घ", "ध", "झ", "ढ", "भर", "घन", "धन", "झट", "ढक"] },
    { name: "L11: पूर्ण अभ्यास 1", dict: true }, { name: "L12: पूर्ण अभ्यास 2", dict: true }, { name: "L13: पूर्ण अभ्यास 3", dict: true }, { name: "L14: वाक्य अभ्यास", dict: true }, { name: "L15: अंतिम परीक्षण", dict: true }
  ],
  krutidev: [
    { name: "L1: मध्य पंक्ति 1 (क, ह, े, ि)", words: ["d", "g", "ds", "fd", "gs", "fg", "dad", "gad", "dg", "gd"] },
    { name: "L2: मध्य पंक्ति 2 (र, स, ा, ी)", words: ["j", "l", "jk", "lk", "jh", "lh", "lkj", "jl", "lj", "lhj"] },
    { name: "L3: ऊपरी पंक्ति 1 (म, त, ज)", words: ["e", "r", "p", "eq", "rw", "pq", "er", "pe", "rqe", "rkt"] },
    { name: "L4: ऊपरी पंक्ति 2 (व, प, न)", words: ["o", "i", "u", "ou", "iu", "uo", "iou", "uko", "iku"] },
    { name: "L5: अभ्यास 1", words: ["jke", "dke", "uke", "gok", "jkr", "ckr", "lkr", "ikl", "[kkl", "ekl"] },
    { name: "L6: निचली पंक्ति 1 (ग, ब, अ)", words: ["x", "c", "v", "xc", "vc", "cx", "vkx", "ckx", "jkx"] },
    { name: "L7: निचली पंक्ति 2 (इ, द, उ)", words: ["b", "n", "m", "bu", "fnu", "mu", "nku", "nke", "nok"] },
    { name: "L8: अभ्यास 2", words: ["fnu", "jkr", "lqcg", "'kke", "vkt", "dy", "vc", "rc", "dc", "lc"] },
    { name: "L9: शिफ्ट (आधे अक्षर 1)", words: ["D", "E", "R", "T", "Y", "L", "O", "I"] },
    { name: "L10: शिफ्ट (आधे अक्षर 2)", words: ["C", "X", "N", "S", "\"", "J", "K", "{"] },
    { name: "L11: पूर्ण अभ्यास 1", dict: true }, { name: "L12: पूर्ण अभ्यास 2", dict: true }, { name: "L13: पूर्ण अभ्यास 3", dict: true }, { name: "L14: वाक्य अभ्यास", dict: true }, { name: "L15: अंतिम परीक्षण", dict: true }
  ]
};

// Map Kruti Dev characters to standard Unicode Hindi for accurate TTS pronunciation in Auditory Mode
const KRUTI_MAP = {
    'k': 'ा', 'i': 'प', 'u': 'न', 'v': 'अ', 'c': 'ब', 'l': 'स', 'e': 'म', 'j': 'र', 'g': 'ह', 'd': 'क', 'r': 'त',
    'o': 'व', 'x': 'ग', 'y': 'ल', 's': 'े', 'a': 'ं', 'h': 'ी', 'q': 'ु', 'w': 'ू', 'm': 'उ', 'n': 'द', 't': 'ज',
    'S': 'ै', 'b': 'इ', 'O': 'ौ', 'p': 'च', 'N': 'छ', 'I': 'प्', 'U': 'न्', 'V': 'ट', 'C': 'ब्', 'L': 'स्', 'E': 'म्',
    'J': 'श्र', 'G': 'ह्', 'D': 'क्', 'R': 'त्', 'F': 'थ्', 'X': 'ग्', 'Y': 'ल्', 'H': 'भ्', 'M': 'ड', 'T': 'ज्',
    'P': 'च्', '~': '्', ',': 'ए', '_': 'रु', '\\': 'ॉ', '-': 'ं', '&': 'ख', '*': 'ं', '$': 'र्',
    '[': 'ख', ']': 'ख', '{': 'क्ष', '}': 'द्व', '|': 'त्र', '/': 'र', '?': 'रु', '>': 'श्र', '<': 'श',
    '"': 'ठ', ';': 'च', ':': 'छ', '\'': 'ट', 'z': '्र', 'Z': 'र्', 'W': 'ू', 'B': 'इ', 'A': 'ं',
    'Q': 'फ', 'f': 'ि'
};

const convertKrutidevToUnicode = (krutiText) => {
    if (!krutiText) return '';
    let unicode = krutiText;
    unicode = unicode.replace(/f(.)/g, "$1ि"); // Fix pre-pended 'ि'
    unicode = unicode.replace(/(.)Z/g, "र्$1"); // Fix post-pended 'र्'
    let result = '';
    for (let i = 0; i < unicode.length; i++) {
        result += KRUTI_MAP[unicode[i]] || unicode[i];
    }
    return result;
};

const applyProMutations = (words, langKey) => {
  return words.map(w => {
    let newWord = w; const rand = Math.random();
    if (langKey === 'english' || langKey === 'python' || langKey === 'javascript' || langKey === 'c' || langKey === 'sql') {
      if (rand < 0.2) newWord = newWord.charAt(0).toUpperCase() + newWord.slice(1);
      if (rand < 0.1) newWord += ','; else if (rand < 0.15) newWord += '.'; else if (rand < 0.18) newWord += '?';
    } else if (langKey.includes('hindi')) {
      const hardPrefixes = ['क्ष', 'त्र', 'ज्ञ', 'श्र', 'छ', 'ठ', 'ढ', 'ध', 'भ'];
      if (rand < 0.10) newWord = hardPrefixes[Math.floor(Math.random() * hardPrefixes.length)] + newWord.slice(1);
      const randPunc = Math.random();
      if (randPunc < 0.10) newWord += '।'; else if (randPunc < 0.15) newWord += ','; else if (randPunc < 0.20) newWord += '?'; 
    }
    return newWord;
  });
};

const formatWordForTTS = (word, langKey) => {
  if (!word) return '';
  let spoken = word;
  
  if (langKey && langKey.includes('krutidev')) {
      spoken = convertKrutidevToUnicode(spoken);
  }

  spoken = spoken.replace(/,/g, ' comma ');
  spoken = spoken.replace(/\./g, ' full stop ');
  spoken = spoken.replace(/\?/g, ' question mark ');
  spoken = spoken.replace(/!/g, ' exclamation mark ');
  spoken = spoken.replace(/।/g, ' purna viram '); 
  return spoken.trim();
};

const useLocalStorage = (key, initialValue) => {
  const [val, setVal] = useState(() => {
    try { const saved = window.localStorage.getItem(key); return saved ? JSON.parse(saved) : initialValue; } 
    catch (error) { return initialValue; }
  });
  useEffect(() => { window.localStorage.setItem(key, JSON.stringify(val)); }, [key, val]);
  return [val, setVal];
};

const useTextEngine = (language, appMode, lessonId, dictionaryMode, selectedParagraphId) => {
  const [words, setWords] = useState([]);
  const [isReady, setIsReady] = useState(false);

  const fetchDictionary = async (langKey) => {
    return new Promise(resolve => setTimeout(() => resolve(BASE_DICTIONARIES[langKey] || BASE_DICTIONARIES.english), 50));
  };

  const generateWordsBatch = useCallback((dict, count) => {
    const parts = language.split('_');
    const levelStr = parts.pop(); 
    const baseLangKey = parts.join('_');
    const level = parseFloat(levelStr) || 1.0;

    if (appMode === 'learning' && lessonId !== null) {
      let langKey = 'english';
      if (language.includes('krutidev')) langKey = 'krutidev';
      else if (language.includes('mangal')) langKey = 'hindi';

      const phase = LEARNING_PHASES[langKey][lessonId];
      if (phase && phase.words) {
         let generated = [];
         for (let i = 0; i < count; i++) generated.push(phase.words[Math.floor(Math.random() * phase.words.length)]);
         return generated;
      } else if (phase && phase.chars) {
         let generated = [];
         const charSet = phase.chars;
         for (let i = 0; i < count; i++) {
           let word = '';
           const len = Math.floor(Math.random() * 3) + 2; 
           for(let j=0; j<len; j++) word += charSet.charAt(Math.floor(Math.random() * charSet.length));
           generated.push(word);
         }
         return generated;
      }
    }

    if (appMode === 'default' && dictionaryMode === 'paragraph') {
      const paraObj = PARAGRAPHS.find(p => p.id === selectedParagraphId) || PARAGRAPHS.find(p => p.lang === baseLangKey);
      if (paraObj) return paraObj.text.trim().split(/\s+/);
      return ["Paragraph", "not", "found", "for", "this", "language."];
    }

    // Auto Mode & Blind Mode Fallthrough: Combine dictionaries and paragraph words properly
    const paragraphWords = PARAGRAPHS
      .filter(p => p.lang === baseLangKey)
      .flatMap(p => p.text.trim().split(/\s+/));
    
    const combinedDict = Array.from(new Set([...dict, ...paragraphWords]));

    let filteredList = combinedDict;
    if (level === 1.0) filteredList = combinedDict.filter(w => w.length <= 4);
    else if (level === 2.0) filteredList = combinedDict.filter(w => w.length >= 4 && w.length <= 7);
    else if (level >= 3.0) filteredList = combinedDict.filter(w => w.length >= 7);
    if (filteredList.length < 15) filteredList = combinedDict;

    let generated = [];
    let lastWord = '';
    for (let i = 0; i < count; i++) {
      let nextWord;
      do { nextWord = filteredList[Math.floor(Math.random() * filteredList.length)]; } while (nextWord === lastWord && filteredList.length > 1);
      generated.push(nextWord); lastWord = nextWord;
    }
    if (level === 4.0) generated = applyProMutations(generated, baseLangKey);
    return generated;
  }, [language, appMode, lessonId, dictionaryMode, selectedParagraphId]);

  const resetEngine = useCallback(async (count = 40) => {
    setIsReady(false);
    const baseLangKey = language.split('_').slice(0, -1).join('_');
    const dict = await fetchDictionary(baseLangKey);
    const initialWords = generateWordsBatch(dict, count);
    setWords(initialWords);
    setIsReady(true);
  }, [language, generateWordsBatch]);

  const appendWords = useCallback(async (count = 20) => {
    if (appMode === 'learning' || (appMode === 'default' && dictionaryMode === 'paragraph')) return; 
    const baseLangKey = language.split('_').slice(0, -1).join('_');
    const dict = await fetchDictionary(baseLangKey);
    const newWords = generateWordsBatch(dict, count);
    setWords(prev => [...prev, ...newWords]);
  }, [language, generateWordsBatch, appMode, dictionaryMode]);

  return { words, isReady, resetEngine, appendWords };
};

const audioCtx = typeof window !== 'undefined' ? new (window.AudioContext || window.webkitAudioContext)() : null;
const playSound = (theme = 'typewriter', isError = false) => {
  if (!audioCtx) return;
  if (audioCtx.state === 'suspended') audioCtx.resume();
  const osc = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();
  osc.connect(gainNode); gainNode.connect(audioCtx.destination);
  const now = audioCtx.currentTime;

  if (isError) {
    osc.type = 'sawtooth'; osc.frequency.setValueAtTime(200, now); osc.frequency.exponentialRampToValueAtTime(50, now + 0.2);
    gainNode.gain.setValueAtTime(0.2, now); gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
    osc.start(); osc.stop(now + 0.2); return;
  }

  switch(theme) {
    case 'mechanical': osc.type = 'triangle'; osc.frequency.setValueAtTime(120, now); osc.frequency.exponentialRampToValueAtTime(30, now + 0.1); gainNode.gain.setValueAtTime(0.3, now); gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.1); osc.start(); osc.stop(now + 0.1); break;
    case 'bubble': osc.type = 'sine'; osc.frequency.setValueAtTime(400, now); osc.frequency.exponentialRampToValueAtTime(800, now + 0.05); gainNode.gain.setValueAtTime(0.2, now); gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.05); osc.start(); osc.stop(now + 0.05); break;
    case 'arcade': osc.type = 'square'; osc.frequency.setValueAtTime(800, now); gainNode.gain.setValueAtTime(0.1, now); gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.05); osc.start(); osc.stop(now + 0.05); break;
    case 'laser': osc.type = 'sawtooth'; osc.frequency.setValueAtTime(1200, now); osc.frequency.exponentialRampToValueAtTime(100, now + 0.1); gainNode.gain.setValueAtTime(0.1, now); gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.1); osc.start(); osc.stop(now + 0.1); break;
    case 'woodblock': osc.type = 'sine'; osc.frequency.setValueAtTime(300, now); osc.frequency.exponentialRampToValueAtTime(100, now + 0.03); gainNode.gain.setValueAtTime(0.4, now); gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.03); osc.start(); osc.stop(now + 0.03); break;
    case 'soft_click': osc.type = 'sine'; osc.frequency.setValueAtTime(200, now); osc.frequency.exponentialRampToValueAtTime(150, now + 0.04); gainNode.gain.setValueAtTime(0.1, now); gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.04); osc.start(); osc.stop(now + 0.04); break;
    case 'blue_switch': osc.type = 'triangle'; osc.frequency.setValueAtTime(600, now); osc.frequency.exponentialRampToValueAtTime(100, now + 0.08); gainNode.gain.setValueAtTime(0.2, now); gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.08); osc.start(); osc.stop(now + 0.08); break;
    case 'chime': osc.type = 'sine'; osc.frequency.setValueAtTime(1200, now); osc.frequency.exponentialRampToValueAtTime(800, now + 0.15); gainNode.gain.setValueAtTime(0.1, now); gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.15); osc.start(); osc.stop(now + 0.15); break;
    case 'thump': osc.type = 'triangle'; osc.frequency.setValueAtTime(80, now); osc.frequency.exponentialRampToValueAtTime(20, now + 0.1); gainNode.gain.setValueAtTime(0.5, now); gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.1); osc.start(); osc.stop(now + 0.1); break;
    default: osc.type = 'square'; osc.frequency.setValueAtTime(150, now); osc.frequency.exponentialRampToValueAtTime(40, now + 0.05); gainNode.gain.setValueAtTime(0.1, now); gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.05); osc.start(); osc.stop(now + 0.05);
  }
};

// ==========================================
// 3. ZERO-LATENCY GRAPHEME RENDERING
// ==========================================
const MemoizedWord = React.memo(({ word = '', typed = '', isActive, displayMode }) => {
  const safeWord = String(word || '');
  const safeTyped = String(typed || '');
  const isErrorWord = !isActive && safeTyped !== safeWord && safeTyped !== '';
  
  const getStatus = (index) => {
    if (index < 0 || index >= safeWord.length) return 'none';
    if (index < safeTyped.length) return safeTyped[index] === safeWord[index] ? 'correct' : 'incorrect';
    return 'untyped';
  };

  if (displayMode === 'twobox') {
     return (
       <div className={`word inline-block mx-[0.4em] my-[0.2em] leading-relaxed transition-colors duration-100 ${isActive ? 'active bg-[var(--text-main)]/10 px-1 rounded' : ''} ${isErrorWord ? 'border-b-2 border-[var(--text-error)]' : ''}`}>
         {safeWord.split('').map((char, charIdx) => {
           const status = getStatus(charIdx);
           let charClass = 'text-[var(--text-sub)] opacity-50'; 
           if (status === 'correct') charClass = 'text-[var(--text-main)] correct font-bold'; 
           else if (status === 'incorrect') charClass = 'text-[var(--text-error)] incorrect line-through';
           return <span key={charIdx} className={`letter inline ${charClass}`}>{char}</span>;
         })}
       </div>
     );
  }

  return (
    <div className={`word relative inline-block mx-[0.4em] my-[0.2em] leading-relaxed transition-colors duration-100 ${isActive ? 'active' : ''} ${isErrorWord ? 'border-b-2 border-[var(--text-error)]' : ''}`}>
      {safeWord.split('').map((char, charIdx) => {
        const status = getStatus(charIdx);
        const prevStatus = getStatus(charIdx - 1);
        let charClass = 'text-[var(--text-sub)] opacity-30'; 
        let explicitStyleColor = 'var(--text-sub)';
        
        if (status === 'correct') { charClass = 'text-[var(--text-main)] correct opacity-100'; explicitStyleColor = 'var(--text-main)'; } 
        else if (status === 'incorrect') { charClass = 'text-[var(--text-error)] bg-[var(--text-error)]/20 incorrect opacity-100'; explicitStyleColor = 'var(--text-error)'; }

        const isExpected = isActive && charIdx === safeTyped.length;
        if (isExpected) { charClass = 'text-[var(--text-sub)] expected opacity-100 bg-[var(--text-sub)]/20 rounded-sm'; explicitStyleColor = 'var(--text-sub)'; }

        let displayChar = char;
        const isCombiningMark = /^\p{M}$/u.test(char);
        if (isCombiningMark && status === 'untyped' && (prevStatus === 'correct' || prevStatus === 'incorrect')) displayChar = '◌' + char;

        return ( <span key={charIdx} className={`letter inline transition-all duration-100 ${charClass}`} style={{ color: explicitStyleColor }}>{displayChar}</span> );
      })}
      {safeTyped.length > safeWord.length && safeTyped.slice(safeWord.length).split('').map((char, charIdx) => (
        <span key={`extra-${charIdx}`} className="letter extra inline text-[var(--text-error)] opacity-70 bg-[var(--text-error)]/20 rounded-sm" style={{ color: 'var(--text-error)' }}>{char}</span>
      ))}
    </div>
  );
});

// ==========================================
// 4. MAIN APP COMPONENT
// ==========================================
export default function App() {
  const [appMode, setAppMode] = useState('home'); 
  const [theme, setTheme] = useState(THEMES.indian);
  const [font, setFont] = useState(FONTS[0]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [soundTheme, setSoundTheme] = useState('typewriter');
  const [displayMode, setDisplayMode] = useLocalStorage('tezzDisplay', 'inline'); 
  const [dictionaryMode, setDictionaryMode] = useState('auto'); 
  const [textSize, setTextSize] = useState(50); 
  const [containerWidth, setContainerWidth] = useState(80); 
  const [scrollOffset, setScrollOffset] = useState(0);
  
  const [mode, setMode] = useState('time'); 
  const [timeConfig, setTimeConfig] = useState(30);
  const [wordConfig, setWordConfig] = useState(25);
  const [language, setLanguage] = useState('english_1.0');
  const [showSettings, setShowSettings] = useState(false);
  const [languageSearch, setLanguageSearch] = useState('');
  
  const [selectedParagraphId, setSelectedParagraphId] = useState('wolf');

  const [learningProgress, setLearningProgress] = useLocalStorage('tezzProgress', { english: 0, hindi: 0, krutidev: 0 });
  const [activeLesson, setActiveLesson] = useState(0);

  const { words, isReady, resetEngine, appendWords } = useTextEngine(language, appMode, activeLesson, dictionaryMode, selectedParagraphId);
  const [typedHistory, setTypedHistory] = useState([]); 
  const [currentWordInput, setCurrentWordInput] = useState('');
  const [activeWordIndex, setActiveWordIndex] = useState(0);
  const [status, setStatus] = useState('idle'); 
  const [timeLeft, setTimeLeft] = useState(0);
  const [keystrokes, setKeystrokes] = useState({ correct: 0, incorrect: 0 });
  const [errorMap, setErrorMap] = useState({});
  const [lastPressedKeyStr, setLastPressedKeyStr] = useState(null);

  const [blindInput, setBlindInput] = useState('');
  const [blindTTSParams, setBlindTTSParams] = useState({ rate: 1.0, voiceLang: 'en-IN' });
  const [blindResult, setBlindResult] = useState(null); 

  const isInputError = useMemo(() => {
    const target = words[activeWordIndex] || '';
    return currentWordInput.length > 0 && !target.startsWith(currentWordInput);
  }, [currentWordInput, activeWordIndex, words]);

  const typingContainerRef = useRef(null);
  const caretRef = useRef(null);
  const timerRef = useRef(null);
  const inputRef = useRef(null);
  
  // TTS State Refs
  const ttsTimeoutRef = useRef(null);
  const currentWordRef = useRef('');
  const isTypingRef = useRef(false);

  useEffect(() => {
    const baseLangKey = language.split('_').slice(0, -1).join('_');
    const availableParagraphs = PARAGRAPHS.filter(p => p.lang === baseLangKey);
    if (dictionaryMode === 'paragraph' && availableParagraphs.length > 0) {
      if (!availableParagraphs.find(p => p.id === selectedParagraphId)) {
         setSelectedParagraphId(availableParagraphs[0].id);
      }
    }
  }, [language, dictionaryMode, selectedParagraphId]);

  useEffect(() => {
    const calculatedFontSize = 1 + (textSize / 100) * 2; 
    const style = document.createElement('style');
    style.innerHTML = `
      @import url('https://fonts.googleapis.com/css2?family=Fira+Code&family=Inconsolata&family=Inter:wght@400;600&family=Kalam&family=Lora&family=Merriweather&family=Montserrat&family=Open+Sans&family=Playfair+Display&family=Poppins&family=Quicksand&family=Roboto+Mono&family=Source+Code+Pro&family=Ubuntu&family=Noto+Sans+Devanagari&family=Yatra+One&family=Mukta&family=Teko&family=Gotu&family=Halant&family=Hind&family=Rajdhani&family=Khand&family=Rozha+One&family=Sahitya&family=Aparajita&display=swap');
      @font-face { 
          font-family: 'Kruti Dev 010'; 
          font-style: normal;
          font-weight: 400;
          src: local('Kruti Dev 010'), 
               url('https://fonts.cdnfonts.com/s/15456/Kruti_Dev_010.woff') format('woff'),
               url('https://db.onlinewebfonts.com/t/790101b0a8eb1b4b74bb81f72d42eb12.woff2') format('woff2'); 
      }
      :root { --bg-color: ${theme.bg}; --text-main: ${theme.main}; --text-sub: ${theme.sub}; --text-color: ${theme.text}; --text-error: ${theme.error}; --font-family: ${font.family}; }
      body { background-color: var(--bg-color); color: var(--text-color); font-family: var(--font-family); transition: background-color 0.3s ease, color 0.3s ease; margin: 0; padding: 0; overflow-x: hidden; }
      .typing-container, input[type="text"], .word, .letter { font-family: var(--font-family) !important; }
      .typing-container { font-size: ${calculatedFontSize}rem; width: ${containerWidth}%; }
      .smooth-caret { position: absolute; top: 0; left: 0; width: 3px; height: 1.4em; background-color: var(--text-main); transition: transform 0.1s cubic-bezier(0.2, 0, 0, 1); will-change: transform; pointer-events: none; z-index: 10; opacity: 1; animation: blink 1s infinite step-start; display: flex; justify-content: center; }
      .smooth-caret.typing { animation: none; opacity: 1; }
      @keyframes blink { 50% { opacity: 0; } }
      .caret-hint { position: absolute; bottom: 110%; font-size: 0.5em; padding: 2px 6px; border-radius: 4px; background-color: var(--text-main); color: var(--bg-color); font-weight: bold; opacity: 0; transition: opacity 0.2s ease; box-shadow: 0 2px 4px rgba(0,0,0,0.1); font-family: var(--font-family) !important; white-space: nowrap; pointer-events: none; }
      .smooth-caret.typing .caret-hint { opacity: 1; }
      .custom-scroll::-webkit-scrollbar { width: 6px; } .custom-scroll::-webkit-scrollbar-thumb { background-color: var(--text-sub); border-radius: 10px; }
      .no-scrollbar::-webkit-scrollbar { display: none; }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, [theme, font, textSize, containerWidth]);

  const startTestEnv = useCallback((overrideStatus) => {
    let wordCount = 40;
    if (appMode === 'learning') wordCount = 20;
    else if (appMode === 'default' && dictionaryMode === 'paragraph') wordCount = 0; 
    else if (mode === 'words') wordCount = wordConfig;
    else if (appMode === 'blind') wordCount = 100; 

    resetEngine(wordCount); 
    setTypedHistory([]); setCurrentWordInput(''); setActiveWordIndex(0); 
    
    const nextStatus = typeof overrideStatus === 'string' ? overrideStatus : 'idle';
    setStatus(nextStatus);

    setTimeLeft(mode === 'time' && appMode === 'default' ? timeConfig : 0);
    setKeystrokes({ correct: 0, incorrect: 0 }); setErrorMap({}); setLastPressedKeyStr(null);
    setBlindInput(''); setBlindResult(null); setScrollOffset(0);
    
    if (timerRef.current) clearInterval(timerRef.current);
    if (inputRef.current) inputRef.current.focus();

    if (appMode === 'blind') {
      setBlindTTSParams(p => ({ ...p, voiceLang: language.includes('mangal') || language.includes('krutidev') ? 'hi-IN' : 'en-IN' }));
    }
  }, [resetEngine, mode, wordConfig, timeConfig, appMode, language, dictionaryMode]);

  useEffect(() => { 
    if (appMode !== 'home' && appMode !== 'learning') startTestEnv('idle'); 
    else if (appMode === 'learning' && status !== 'ready' && status !== 'running') setStatus('idle'); 
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appMode, language, dictionaryMode, selectedParagraphId]);

  useEffect(() => {
    if (appMode === 'default' && mode === 'time' && dictionaryMode === 'auto' && status === 'running' && words.length > 0) {
      if (activeWordIndex >= words.length - 15) appendWords(20); 
    }
  }, [activeWordIndex, words.length, mode, status, appendWords, appMode, dictionaryMode]);

  useEffect(() => {
    if (appMode === 'blind' || !typingContainerRef.current || status === 'finished') return;
    const container = typingContainerRef.current;
    const activeWordEl = container.querySelector('.word.active');
    
    if (activeWordEl) {
      const top = activeWordEl.offsetTop;
      if (top > 40) setScrollOffset(top - 20); 
      else setScrollOffset(0);

      if (displayMode === 'inline' && caretRef.current) {
        const caret = caretRef.current;
        const hint = caret.querySelector('.caret-hint');
        caret.classList.add('typing'); clearTimeout(caret.blinkTimeout);
        caret.blinkTimeout = setTimeout(() => caret.classList.remove('typing'), 500);

        let targetEl = activeWordEl.querySelector('.letter.expected');
        let isEndOfWord = false;
        if (!targetEl) {
          const letters = activeWordEl.querySelectorAll('.letter'); targetEl = letters[letters.length - 1]; isEndOfWord = true;
        }
        
        let x = activeWordEl.offsetLeft;
        let y = activeWordEl.offsetTop;

        if (targetEl) {
          x += targetEl.offsetLeft;
          y += targetEl.offsetTop + (targetEl.offsetHeight * 0.1); 
          if (isEndOfWord) x += targetEl.offsetWidth;
          caret.style.transform = `translate(${x}px, ${y}px)`;

          if (hint) {
            if (!isEndOfWord) {
              const wordString = words[activeWordIndex];
              if (wordString && currentWordInput.length < wordString.length) {
                let char = wordString[currentWordInput.length];
                if (/^\p{M}$/u.test(char)) char = '◌' + char; 
                hint.textContent = char; hint.style.opacity = '1';
              }
            } else { hint.textContent = '␣'; hint.style.opacity = '1'; }
          }
        }
      }
    }
  }, [currentWordInput, activeWordIndex, words, status, appMode, displayMode]);

  // Sync refs for the TTS loop to read cleanly without closure stale bugs
  useEffect(() => {
      currentWordRef.current = words[activeWordIndex] || '';
      isTypingRef.current = blindInput.length > 0 || !!blindResult;
  }, [words, activeWordIndex, blindInput, blindResult]);

  // Continuous TTS speaking logic that repeats until user starts typing
  const speakWordLoop = useCallback(() => {
      if (!window.speechSynthesis) return;
      window.speechSynthesis.cancel();
      clearTimeout(ttsTimeoutRef.current);

      if (appMode !== 'blind' || (status !== 'running' && status !== 'ready')) return;
      if (isTypingRef.current || !currentWordRef.current) return;

      const textToSpeak = formatWordForTTS(currentWordRef.current, language);
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = blindTTSParams.voiceLang;
      utterance.rate = blindTTSParams.rate;

      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
          let exactVoice = voices.find(v => v.lang === blindTTSParams.voiceLang);
          if (!exactVoice) exactVoice = voices.find(v => v.lang.includes('IN'));
          if (exactVoice) utterance.voice = exactVoice;
      }

      utterance.onend = () => {
          ttsTimeoutRef.current = setTimeout(() => {
              if (!isTypingRef.current && appMode === 'blind' && (status === 'running' || status === 'ready')) {
                  speakWordLoop();
              }
          }, 1500);
      };

      utterance.onerror = () => {
           ttsTimeoutRef.current = setTimeout(() => {
              if (!isTypingRef.current && appMode === 'blind') speakWordLoop();
           }, 3000);
      };

      window.speechSynthesis.speak(utterance);
  }, [appMode, status, blindTTSParams, language]);

  // Trigger continuous TTS loop when word changes, or stop when user types
  useEffect(() => {
      if (appMode === 'blind' && (status === 'running' || status === 'ready')) {
          if (blindInput.length === 0 && !blindResult) {
              speakWordLoop();
          } else {
              window.speechSynthesis?.cancel();
              clearTimeout(ttsTimeoutRef.current);
          }
      } else {
          window.speechSynthesis?.cancel();
          clearTimeout(ttsTimeoutRef.current);
      }
      return () => {
          window.speechSynthesis?.cancel();
          clearTimeout(ttsTimeoutRef.current);
      };
  }, [activeWordIndex, status, appMode, blindInput, blindResult, speakWordLoop]);


  const upcomingChars = useMemo(() => {
    if (appMode !== 'learning' || displayMode !== 'inline' || status === 'finished' || status === 'idle') return ['', '', ''];
    let chars = [];
    let wIdx = activeWordIndex;
    let cIdx = currentWordInput.length;
    
    while (chars.length < 3 && wIdx < words.length) {
      const word = words[wIdx];
      if (cIdx < word.length) {
        chars.push(word[cIdx]);
        cIdx++;
      } else {
        chars.push(' ');
        wIdx++;
        cIdx = 0;
      }
    }
    while (chars.length < 3) chars.push('');
    return chars;
  }, [appMode, displayMode, status, activeWordIndex, currentWordInput, words]);

  const startTimer = () => {
    if (status === 'running') return;
    setStatus('running');
    if (appMode === 'default' && mode === 'time') {
      timerRef.current = setInterval(() => { setTimeLeft(prev => { if (prev <= 1) { endTest(); return 0; } return prev - 1; }); }, 1000);
    } else {
      timerRef.current = setInterval(() => { setTimeLeft(prev => prev + 1); }, 1000);
    }
  };

  const endTest = () => {
    setStatus('finished');
    if (timerRef.current) clearInterval(timerRef.current);
    
    if (appMode === 'learning') {
      const res = calculateResults();
      if (res.accuracy >= 85) {
        let langKey = 'english';
        if (language.includes('krutidev')) langKey = 'krutidev';
        else if (language.includes('mangal')) langKey = 'hindi';
        
        if (activeLesson >= (learningProgress[langKey] || 0)) {
          setLearningProgress(prev => ({ ...prev, [langKey]: (prev[langKey] || 0) + 1 }));
        }
      }
    }
  };

  const isCompletedCondition = useCallback(() => {
     if (appMode === 'learning' && activeWordIndex >= 19) return true;
     if (appMode === 'default') {
        let targetCount = words.length;
        if (mode === 'words') {
           targetCount = dictionaryMode === 'auto' ? wordConfig : Math.min(wordConfig, words.length);
        }
        if (activeWordIndex >= targetCount - 1) return true;
     }
     return false;
  }, [appMode, dictionaryMode, words.length, wordConfig, mode, activeWordIndex]);

  const handleInputChange = (e) => {
     if (status === 'finished' || !isReady || appMode === 'blind') return;
     if (status === 'idle' || status === 'ready') startTimer();
     
     const val = e.target.value;
     
     if (val.endsWith(' ')) {
        const trimmed = val.slice(0, -1);
        if (trimmed === '' && currentWordInput === '') return;
        
        setTypedHistory(prev => [...prev, trimmed]);
        
        if (isCompletedCondition()) {
          endTest();
        } else { 
          setActiveWordIndex(idx => idx + 1); 
          setCurrentWordInput(''); 
        }
        return;
     }

     if (val.length > currentWordInput.length) {
        const targetWord = words[activeWordIndex] || '';
        const charTyped = val.slice(-1);
        const expectedChar = targetWord[val.length - 1];
        setLastPressedKeyStr(charTyped);

        if (charTyped === expectedChar) {
           setKeystrokes(k => ({...k, correct: k.correct + 1}));
           if (soundEnabled) playSound(soundTheme, false);
        } else {
           setKeystrokes(k => ({...k, incorrect: k.incorrect + 1}));
           if (soundEnabled) playSound(soundTheme, true);
           if (expectedChar) setErrorMap(prev => ({...prev, [expectedChar]: (prev[expectedChar] || 0) + 1}));
        }
     }
     setCurrentWordInput(val);
  };

  const handleInputKeyDown = (e) => {
    if (e.target.tagName === 'SELECT') return;
    if (status === 'finished' || showSettings || !isReady) return;
    if (e.key === 'Tab') { e.preventDefault(); startTestEnv(appMode === 'learning' ? 'ready' : 'idle'); return; }
    
    if (e.key === 'Backspace' && currentWordInput === '' && activeWordIndex > 0) {
       e.preventDefault();
       const prevInput = typedHistory[activeWordIndex - 1] || '';
       setActiveWordIndex(activeWordIndex - 1);
       setCurrentWordInput(prevInput);
       setTypedHistory(prev => prev.slice(0, -1));
    }
  };

  const handleDefaultKeyDown = useCallback((e) => {
    if (e.target.tagName === 'SELECT') return;
    if (e.target.tagName === 'BUTTON' && (e.key === ' ' || e.key === 'Enter')) return;

    if (displayMode === 'twobox' && appMode !== 'blind') return; 
    if (status === 'finished' || showSettings || !isReady || appMode === 'home') return;
    if (status === 'idle' && appMode === 'blind') return;

    if (e.key === 'Tab') { e.preventDefault(); startTestEnv(appMode === 'learning' ? 'ready' : 'idle'); return; }
    if (e.key === 'Enter' && appMode !== 'blind') { e.preventDefault(); startTestEnv(appMode === 'learning' ? 'ready' : 'idle'); return; }
    
    if (['Shift', 'Control', 'Alt', 'Meta', 'CapsLock', 'Dead'].includes(e.key)) { if(e.key === 'Shift') setLastPressedKeyStr('Shift'); return; }

    if ((status === 'idle' || status === 'ready') && e.key.length === 1) startTimer();

    if (appMode === 'blind') {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const expected = words[activeWordIndex] || '';
        const isCorrect = blindInput === expected;
        setBlindResult({ correct: isCorrect, expected, typed: blindInput });
        
        if (isCorrect) setKeystrokes(k => ({ correct: k.correct + expected.length, incorrect: k.incorrect }));
        else setKeystrokes(k => ({ correct: k.correct, incorrect: k.incorrect + expected.length }));

        if (soundEnabled) playSound(soundTheme, !isCorrect);

        setTimeout(() => {
          setBlindResult(null); 
          setBlindInput('');
          setActiveWordIndex(idx => idx + 1);
        }, 1500);
        return;
      }
      if (e.key === 'Backspace') { setBlindInput(prev => prev.slice(0, -1)); return; }
      if (e.key.length === 1) { 
          window.speechSynthesis?.cancel(); 
          setBlindInput(prev => prev + e.key); 
          setLastPressedKeyStr(e.key); 
          if (soundEnabled) playSound(soundTheme, false); 
      }
      return;
    }

    const currentWord = words[activeWordIndex];
    if (!currentWord) return;
    setLastPressedKeyStr(e.key);

    if (e.key === 'Backspace') {
      e.preventDefault();
      if (currentWordInput.length > 0) setCurrentWordInput(prev => prev.slice(0, -1));
      else if (activeWordIndex > 0) {
        const prevWord = words[activeWordIndex - 1]; const prevInput = typedHistory[activeWordIndex - 1] || '';
        if (prevInput !== prevWord) { setActiveWordIndex(activeWordIndex - 1); setCurrentWordInput(prevInput); setTypedHistory(prev => prev.slice(0, -1)); }
      }
      return;
    }

    if (e.key === ' ' || e.code === 'Space') {
      e.preventDefault();
      if (currentWordInput.length === 0) return; 
      setTypedHistory(prev => [...prev, currentWordInput]);
      
      if (isCompletedCondition()) {
        endTest();
      } else { setActiveWordIndex(idx => idx + 1); setCurrentWordInput(''); }
      return;
    }

    if (e.key.length === 1) {
      e.preventDefault();
      const expChar = currentWord[currentWordInput.length];
      if (e.key === expChar) { if (soundEnabled) playSound(soundTheme, false); setKeystrokes(k => ({ ...k, correct: k.correct + 1 })); } 
      else { if (soundEnabled) playSound(soundTheme, true); setKeystrokes(k => ({ ...k, incorrect: k.incorrect + 1 })); if (expChar) setErrorMap(prev => ({ ...prev, [expChar]: (prev[expChar] || 0) + 1 })); }
      setCurrentWordInput(prev => prev + e.key);
    }
  }, [status, isReady, words, activeWordIndex, currentWordInput, typedHistory, mode, soundEnabled, soundTheme, showSettings, startTestEnv, appMode, blindInput, displayMode, isCompletedCondition]);

  useEffect(() => { window.addEventListener('keydown', handleDefaultKeyDown); return () => window.removeEventListener('keydown', handleDefaultKeyDown); }, [handleDefaultKeyDown]);


  const calculateResults = useCallback(() => {
    const totalTimeSeconds = (appMode === 'default' && mode === 'time') ? (timeConfig - timeLeft) : timeLeft;
    const totalTimeMinutes = totalTimeSeconds / 60; 
    const totalCharsTyped = keystrokes.correct + keystrokes.incorrect;
    
    let correctWordsCount = 0;
    typedHistory.forEach((typed, i) => { if (typed === words[i]) correctWordsCount++; });
    if (status === 'finished' && currentWordInput === words[activeWordIndex]) correctWordsCount++;

    const wpmGross = totalTimeMinutes > 0 ? Math.round((totalCharsTyped / 5) / totalTimeMinutes) : 0;
    const wpmNet = totalTimeMinutes > 0 ? Math.round((keystrokes.correct / 5) / totalTimeMinutes) : 0;
    const accuracy = totalCharsTyped > 0 ? Math.round((keystrokes.correct / totalCharsTyped) * 100) : 0;
    const weakKeys = Object.entries(errorMap).sort((a, b) => b[1] - a[1]).slice(0, 3).map(e => e[0]);

    return { wpmNet, wpmGross, accuracy, correctWordsCount, weakKeys, totalTimeSeconds };
  }, [status, keystrokes, typedHistory, timeLeft, timeConfig, mode, errorMap, words, activeWordIndex, currentWordInput, appMode]);

  const results = useMemo(() => calculateResults(), [calculateResults]);

  const renderedWordList = useMemo(() => {
    if (appMode === 'learning' && displayMode === 'inline') return null; 
    return words.map((word, index) => {
      const isActive = index === activeWordIndex;
      const isTyped = index < activeWordIndex;
      const typed = isTyped ? (typedHistory[index] || '') : (isActive ? (currentWordInput || '') : '');
      return <MemoizedWord key={index} word={word || ''} typed={typed} isActive={isActive} displayMode={displayMode} />;
    });
  }, [words, activeWordIndex, typedHistory, currentWordInput, appMode, displayMode]);

  const renderKeyboard = () => {
    const isKrutidev = language.includes('krutidev');
    const isMangal = language.includes('mangal');
    const isHindi = isMangal; // Only Mangal maps the strict layout properties inside the array visually this way
    const currentWord = words[activeWordIndex] || '';
    const expectedChar = appMode === 'blind' ? null : (currentWord ? currentWord[currentWordInput.length] : null);

    let expectedCode = null; let expectedRequiresShift = false;
    if (expectedChar === undefined || expectedChar === ' ') expectedCode = 'Space';
    else if (expectedChar) {
       for (const row of KEYBOARD_LAYOUT) {
          for (const key of row) {
             if (isHindi) {
                if (key.hi === expectedChar) { expectedCode = key.code; expectedRequiresShift = false; }
                if (key.hiShift === expectedChar) { expectedCode = key.code; expectedRequiresShift = true; }
             } else {
                // English and KrutiDev map against English keys directly 
                if (key.en === expectedChar) { expectedCode = key.code; expectedRequiresShift = false; }
                if (key.enShift === expectedChar) { expectedCode = key.code; expectedRequiresShift = true; }
             }
          }
       }
    }

    return (
      <div className="mt-4 flex flex-col items-center gap-1 sm:gap-1.5 w-full mx-auto p-4 rounded-2xl bg-[var(--text-sub)]/5 border border-[var(--text-sub)]/10 shadow-lg transition-all duration-300">
        {KEYBOARD_LAYOUT.map((row, rowIdx) => (
          <div key={rowIdx} className="flex gap-1 sm:gap-1.5 w-full justify-center">
            {row.map((key) => {
              const isExpected = expectedCode === key.code || (expectedRequiresShift && key.code.includes('Shift'));
              let isLastPressed = false;
              if (lastPressedKeyStr) {
                if (key.code.includes('Shift') && lastPressedKeyStr === 'Shift') isLastPressed = true;
                else if (isHindi && (key.hi === lastPressedKeyStr || key.hiShift === lastPressedKeyStr)) isLastPressed = true;
                else if (!isHindi && (key.en === lastPressedKeyStr || key.enShift === lastPressedKeyStr)) isLastPressed = true;
                else if (key.display === lastPressedKeyStr) isLastPressed = true;
                else if (lastPressedKeyStr.toLowerCase() === key.en) isLastPressed = true;
              }

              let bgClass = "bg-[var(--bg-color)] border-[var(--text-sub)]/30"; let textClass = "text-[var(--text-sub)]";
              if (isExpected && appMode !== 'blind') { bgClass = "bg-[var(--text-main)]/20 border-[var(--text-main)]"; textClass = "text-[var(--text-main)] font-bold"; } 
              else if (isLastPressed) { bgClass = "bg-[var(--text-sub)]/30 border-[var(--text-sub)]"; }

              if (key.isSpecial) return (
                <div key={key.code} className={`flex items-center justify-center ${key.width} h-8 sm:h-12 rounded-md border-b-4 uppercase transition-all duration-100 ${bgClass} ${textClass} ${isLastPressed ? 'translate-y-1 border-b-0 h-7 sm:h-11 mt-1' : ''}`} style={{ fontSize: '0.65rem' }}>{key.display}</div>
              );

              let displayLower = isMangal ? key.hi : key.en;
              let displayUpper = isMangal ? key.hiShift : key.enShift;

              return (
                <div key={key.code} className={`flex flex-col justify-between w-7 sm:w-12 h-8 sm:h-12 rounded-md border-b-4 p-0.5 sm:p-1 px-1 sm:px-1.5 transition-all duration-100 ${bgClass} ${textClass} ${isLastPressed ? 'translate-y-1 border-b-0 h-7 sm:h-11 mt-1' : ''}`}>
                  <span className={`text-left text-[0.5rem] sm:text-xs font-semibold ${isExpected && expectedRequiresShift ? 'text-[var(--text-main)] scale-110' : 'opacity-70'} ${isKrutidev ? 'font-krutidev text-base' : ''}`} style={isKrutidev ? { fontFamily: "'Kruti Dev 010', sans-serif" } : {}}>{displayUpper}</span>
                  <span className={`text-right text-[0.6rem] sm:text-base font-bold ${isExpected && !expectedRequiresShift ? 'text-[var(--text-main)] scale-110' : ''} ${isKrutidev ? 'font-krutidev text-xl' : ''}`} style={isKrutidev ? { fontFamily: "'Kruti Dev 010', sans-serif" } : {}}>{displayLower}</span>
                </div>
              );
            })}
          </div>
        ))}
        <div className={`mt-1 flex items-center justify-center w-[60%] sm:w-[50%] h-8 sm:h-12 rounded-md border-b-4 transition-all duration-100 ${expectedCode === 'Space' && appMode !== 'blind' ? 'bg-[var(--text-main)]/20 border-[var(--text-main)] text-[var(--text-main)] font-bold' : 'bg-[var(--bg-color)] border-[var(--text-sub)]/30 text-[var(--text-sub)]'} ${lastPressedKeyStr === ' ' ? 'translate-y-1 border-b-0 h-7 sm:h-11 mt-2' : ''}`} style={{ fontSize: '0.7rem' }}>SPACE</div>
      </div>
    );
  };

  const handleLearningLang = (langId) => {
    setLanguage(langId);
    setActiveLesson(0);
    if (langId.includes('krutidev')) setFont(FONTS.find(f => f.id === 'krutidev'));
    else if (langId.includes('mangal')) setFont(FONTS.find(f => f.id === 'mangal'));
    else setFont(FONTS.find(f => f.id === 'inter'));
  };

  const blindGraphemes = useMemo(() => {
    if (!blindInput) return [];
    if (typeof Intl !== 'undefined' && Intl.Segmenter) {
       return Array.from(new Intl.Segmenter(language.includes('mangal') || language.includes('krutidev') ? 'hi-IN' : 'en-US', { granularity: 'grapheme' }).segment(blindInput)).map(s => {
           let seg = s.segment;
           if (/^\p{M}$/u.test(seg)) return '◌' + seg;
           return seg;
       });
    }
    return blindInput.split('').map(c => /^\p{M}$/u.test(c) ? '◌'+c : c);
  }, [blindInput, language]);

  // ROUTER
  if (appMode === 'home') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-[var(--bg-color)]">
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-8 duration-700">
           <img src="/logo.png" alt="App Logo" className="w-20 h-20 mx-auto mb-6" />
           <h1 className="text-5xl font-black text-[var(--text-main)] tracking-tight mb-3">TezzTyping <span className="text-[var(--text-sub)]">PRO</span></h1>
           <p className="text-lg text-[var(--text-sub)] max-w-lg mx-auto">Minimalist touch-typing with structured courses, auditory blind training.</p>
           <p className="text-lg text-[var(--text-sub)] max-w-lg mx-auto">Powered by <strong>APOcademy</strong></p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full px-4">
          <button onClick={() => setAppMode('learning')} className="group flex flex-col items-center text-center p-10 bg-[var(--text-sub)]/5 rounded-3xl border border-[var(--text-sub)]/20 hover:border-[var(--text-main)] hover:bg-[var(--text-main)]/5 transition-all hover:-translate-y-2">
            <div className="w-20 h-20 bg-[var(--text-main)]/20 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"><GraduationCap size={40} className="text-[var(--text-main)]" /></div>
            <h2 className="text-2xl font-bold text-[var(--text-main)] mb-3">Learning Curriculum</h2>
            <p className="text-[var(--text-sub)] text-sm leading-relaxed">Structured 30-lesson courses from beginner basics to advanced punctuation. All levels unlocked.</p>
          </button>
          
          <button onClick={() => setAppMode('default')} className="group flex flex-col items-center text-center p-10 bg-[var(--text-sub)]/5 rounded-3xl border border-[var(--text-sub)]/20 hover:border-[var(--text-main)] hover:bg-[var(--text-main)]/5 transition-all hover:-translate-y-2">
            <div className="w-20 h-20 bg-[var(--text-main)]/20 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"><Gamepad2 size={40} className="text-[var(--text-main)]" /></div>
            <h2 className="text-2xl font-bold text-[var(--text-main)] mb-3">Arcade Mode</h2>
            <p className="text-[var(--text-sub)] text-sm leading-relaxed">The classic zero-latency typing sandbox. Endless words, timed tests, and programming code practice.</p>
          </button>
          
          <button onClick={() => setAppMode('blind')} className="group flex flex-col items-center text-center p-10 bg-[var(--text-sub)]/5 rounded-3xl border border-[var(--text-sub)]/20 hover:border-[var(--text-main)] hover:bg-[var(--text-main)]/5 transition-all hover:-translate-y-2">
            <div className="w-20 h-20 bg-[var(--text-main)]/20 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"><Headphones size={40} className="text-[var(--text-main)]" /></div>
            <h2 className="text-2xl font-bold text-[var(--text-main)] mb-3">Blind Auditory Mode</h2>
            <p className="text-[var(--text-sub)] text-sm leading-relaxed">No visuals. Pure audio TTS dictation. Test your true muscle memory by typing what you hear.</p>
          </button>
        </div>

        {/* --- START OF SOCIAL LINKS FOOTER --- */}
        <div className="mt-20 flex flex-col items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <p className="text-[var(--text-sub)] font-semibold text-sm uppercase tracking-widest">Connect with us</p>
          <div className="flex gap-6">
            
            {/* Instagram Link */}
            <a href="https://www.instagram.com/anujpal_official/" target="_blank" rel="noopener noreferrer" className="p-3 bg-[var(--text-sub)]/5 rounded-full hover:bg-[#E1306C]/10 hover:text-[#E1306C] text-[var(--text-sub)] transition-all hover:-translate-y-1 hover:shadow-lg">
              <Camera size={24} />
            </a>

            {/* YouTube Link */}
            <a href="https://www.youtube.com/channel/UCQU4GVWSFN7X75VelLKROKQ" target="_blank" rel="noopener noreferrer" className="p-3 bg-[var(--text-sub)]/5 rounded-full hover:bg-[#FF0000]/10 hover:text-[#FF0000] text-[var(--text-sub)] transition-all hover:-translate-y-1 hover:shadow-lg">
              <Video size={24} />
            </a>

            {/* Institute Website Link */}
            <a href="mailto:anujpalofficial@gmail.com" className="p-3 bg-[var(--text-sub)]/5 rounded-full hover:bg-[#EA4335]/10 hover:text-[#EA4335] text-[var(--text-sub)] transition-all hover:-translate-y-1 hover:shadow-lg">
              <Mail size={24} />
            </a>

          </div>
          <p className="text-[var(--text-sub)] text-xs opacity-60 mt-2">© 2026 Powered by APOcademy. All rights reserved.</p>
        </div>
        {/* --- END OF SOCIAL LINKS FOOTER --- */}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col p-4 sm:p-8" onClick={(e) => {
       const tag = e.target.tagName;
       if(appMode !== 'blind' && displayMode === 'inline' && !['SELECT', 'BUTTON', 'OPTION', 'INPUT'].includes(tag)) {
          inputRef.current?.focus();
       }
    }}>
      
      <header className="max-w-6xl w-full mx-auto flex justify-between items-center mb-8">
        <div className="flex items-center gap-4 select-none">
          <button onClick={() => setAppMode('home')} className="p-3 bg-[var(--text-sub)]/10 rounded-xl hover:bg-[var(--text-main)]/20 hover:text-[var(--text-main)] transition-colors"><ArrowLeft size={24} /></button>
          <div><h1 className="text-2xl font-bold text-[var(--text-main)] tracking-tight capitalize">{appMode} Mode</h1><p className="text-xs text-[var(--text-sub)] font-semibold uppercase tracking-wider">{language.replace(/_/g, ' ')}</p></div>
        </div>
        <div className="flex items-center gap-4 text-[var(--text-sub)]">
          <button onClick={() => setSoundEnabled(!soundEnabled)} className="hover:text-[var(--text-main)] transition-colors p-2">{soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}</button>
          <button onClick={() => setShowSettings(true)} className="hover:text-[var(--text-main)] transition-colors p-2"><Settings size={20} /></button>
        </div>
      </header>

      <main className="flex-1 w-full flex flex-col items-center">
        
        {/* LEARNING MODE SELECTOR */}
        {appMode === 'learning' && status === 'idle' && !showSettings && (
          <div className="w-full max-w-4xl mb-12 animate-in fade-in">
            <div className="mb-8 p-6 bg-[var(--text-sub)]/5 rounded-2xl border border-[var(--text-sub)]/10 text-center">
               <h3 className="text-lg font-bold text-[var(--text-main)] mb-4">Choose Course Language</h3>
               <div className="flex flex-wrap justify-center gap-4">
                 <button onClick={() => handleLearningLang('english_1.0')} className={`px-6 py-3 rounded-xl font-bold transition-all ${language.includes('english') ? 'bg-[var(--text-main)] text-[var(--bg-color)] shadow-md' : 'bg-[var(--text-sub)]/10 text-[var(--text-color)] hover:bg-[var(--text-sub)]/20'}`}>English</button>
                 <button onClick={() => handleLearningLang('hindi_mangal_1.0')} className={`px-6 py-3 rounded-xl font-bold transition-all ${language.includes('mangal') ? 'bg-[var(--text-main)] text-[var(--bg-color)] shadow-md' : 'bg-[var(--text-sub)]/10 text-[var(--text-color)] hover:bg-[var(--text-sub)]/20'}`}>Hindi (Mangal)</button>
                 <button onClick={() => handleLearningLang('hindi_krutidev_1.0')} className={`px-6 py-3 rounded-xl font-bold transition-all ${language.includes('krutidev') ? 'bg-[var(--text-main)] text-[var(--bg-color)] shadow-md' : 'bg-[var(--text-sub)]/10 text-[var(--text-color)] hover:bg-[var(--text-sub)]/20'}`}>Hindi (Krutidev)</button>
               </div>
            </div>

            <h2 className="text-xl font-bold text-[var(--text-main)] mb-6 flex items-center gap-3"><GraduationCap /> Curriculum Modules</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3">
              {LEARNING_PHASES[language.includes('krutidev') ? 'krutidev' : language.includes('mangal') ? 'hindi' : 'english'].map((lesson, idx) => {
                const isSelected = activeLesson === idx;
                return (
                  <button key={idx} onClick={() => { setActiveLesson(idx); }}
                    className={`p-3 rounded-xl border text-sm flex flex-col items-center gap-2 transition-all ${isSelected ? 'border-[var(--text-main)] bg-[var(--text-main)]/10 text-[var(--text-main)] shadow-md scale-105' : 'border-[var(--text-sub)]/30 hover:border-[var(--text-main)] hover:bg-[var(--text-sub)]/10'}`}>
                    <span className="font-bold">L{idx + 1}</span>
                    <span className="text-[10px] truncate w-full text-center opacity-80">{lesson.name}</span>
                  </button>
                );
              })}
            </div>
            <div className="mt-8 p-4 bg-[var(--text-sub)]/10 rounded-2xl flex justify-between items-center">
              <div>
                <p className="font-bold text-[var(--text-main)] text-lg">{LEARNING_PHASES[language.includes('krutidev') ? 'krutidev' : language.includes('mangal') ? 'hindi' : 'english'][activeLesson].name}</p>
                <p className="text-sm text-[var(--text-sub)] mt-1">Goal: 85% Accuracy to pass lesson.</p>
              </div>
              <button onClick={() => { startTestEnv('ready'); }} className="px-6 py-3 bg-[var(--text-main)] text-[var(--bg-color)] rounded-lg font-bold hover:opacity-90 flex items-center gap-2"><Play size={18}/> Start Lesson</button>
            </div>
          </div>
        )}

        {appMode === 'learning' && (status === 'running' || status === 'ready') && !showSettings && (
          <div className="relative mx-auto transition-all duration-300 flex flex-col items-center w-full max-w-4xl">
            <div className="flex justify-between items-center mb-4 font-bold text-[var(--text-main)] w-full" style={{ fontSize: '1.2rem' }}>
              <div>{`${activeWordIndex}/${20}`}</div>
              <div className="text-[var(--text-sub)] font-medium flex gap-4" style={{ fontSize: '1rem' }}><span>WPM: {results.wpmNet || 0}</span><span>ACC: {results.accuracy || 100}%</span></div>
            </div>

            {!isReady ? (
               <div className="flex justify-center items-center h-[180px] text-[var(--text-sub)] animate-pulse w-full">Loading Engine...</div>
            ) : (
              <div className="flex flex-col items-center justify-center w-full mb-2 mt-2 animate-in fade-in duration-500">
                 {displayMode === 'inline' ? (
                   <>
                     <div className="text-[var(--text-sub)] mb-4 text-sm uppercase tracking-widest font-bold">Upcoming Keystrokes</div>
                     <div className="flex gap-4 sm:gap-6">
                       {upcomingChars.map((ch, i) => {
                          let displayCh = ch === ' ' ? '␣' : ch;
                          if (displayCh && /^\p{M}$/u.test(displayCh)) displayCh = '◌' + displayCh;
                          return (
                            <div key={i} className={`flex items-center justify-center w-20 h-24 sm:w-28 sm:h-32 rounded-2xl border-4 text-4xl sm:text-6xl font-bold transition-all duration-200 overflow-hidden leading-none ${i === 0 ? 'border-[var(--text-main)] text-[var(--text-main)] bg-[var(--text-main)]/10 scale-110 shadow-[0_0_20px_rgba(0,0,0,0.1)] shadow-[var(--text-main)]/20 z-10' : 'border-[var(--text-sub)]/20 text-[var(--text-sub)] opacity-60 scale-90'}`}>
                              <span className="inline-block relative z-10 leading-none">{displayCh}</span>
                            </div>
                          );
                       })}
                     </div>
                     <input ref={inputRef} type="text" className="opacity-0 absolute top-0 left-0 w-1 h-1 pointer-events-none" onBlur={() => { if(status === 'running') inputRef.current?.focus() }} />
                   </>
                 ) : (
                   <div className="w-full flex flex-col gap-6">
                     <div ref={typingContainerRef} className="h-40 overflow-hidden relative select-none w-full p-6 bg-[var(--text-sub)]/5 rounded-2xl border border-[var(--text-sub)]/20 flex flex-wrap content-start leading-relaxed text-2xl sm:text-3xl" style={{ maskImage: 'linear-gradient(to bottom, transparent 0%, black 10%, black 80%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 10%, black 80%, transparent 100%)' }}>
                        <div className="flex flex-wrap relative z-0 w-full" style={{ transform: `translateY(-${scrollOffset}px)`, transition: 'transform 0.2s ease-out' }}>
                           {renderedWordList}
                        </div>
                     </div>
                     <div className="relative w-full">
                        <input ref={inputRef} type="text" value={currentWordInput} onChange={handleInputChange} onKeyDown={handleInputKeyDown} onBlur={() => { if(status === 'running') inputRef.current?.focus() }}
                          className={`w-full p-4 sm:p-6 text-2xl sm:text-4xl text-center rounded-2xl border-4 outline-none transition-colors font-bold ${isInputError ? 'border-[var(--text-error)] text-[var(--text-error)] bg-[var(--text-error)]/5' : 'border-[var(--text-main)] text-[var(--text-main)] bg-[var(--text-main)]/5'}`}
                          placeholder="Type here..." autoComplete="off" autoCorrect="off" spellCheck="false" disabled={status === 'finished'} />
                     </div>
                   </div>
                 )}
              </div>
            )}
            
            <div className="w-full mt-2">{renderKeyboard()}</div>
            <div className="text-center mt-6 text-[var(--text-sub)] opacity-50 hover:opacity-100 transition-opacity w-full"><button onClick={() => startTestEnv('idle')} className="flex items-center justify-center gap-2 mx-auto hover:text-[var(--text-main)]"><ArrowLeft size={16} /> Exit Lesson</button></div>
          </div>
        )}

        {/* DEFAULT / ARCADE MODE SELECTOR */}
        {appMode === 'default' && status === 'idle' && !showSettings && (
          <div className="flex flex-wrap justify-center gap-4 sm:gap-8 mb-8 text-sm font-medium text-[var(--text-sub)] bg-[var(--text-sub)]/5 py-3 px-6 rounded-2xl backdrop-blur-md border border-[var(--text-sub)]/10">
            <div className="flex gap-3 items-center border-r border-[var(--text-sub)]/20 pr-4 sm:pr-8">
              <button onClick={() => setDictionaryMode('auto')} className={`hover:text-[var(--text-main)] ${dictionaryMode === 'auto' ? 'text-[var(--text-main)] font-bold' : ''}`}>Auto</button>
              <button onClick={() => setDictionaryMode('paragraph')} className={`hover:text-[var(--text-main)] ${dictionaryMode === 'paragraph' ? 'text-[var(--text-main)] font-bold' : ''}`}>Paragraph</button>
            </div>
            
            <div className="flex gap-3 items-center border-r border-[var(--text-sub)]/20 pr-4 sm:pr-8">
              <button onClick={() => setMode('time')} className={`hover:text-[var(--text-main)] ${mode === 'time' ? 'text-[var(--text-main)] font-bold' : ''}`}>Time</button>
              <button onClick={() => setMode('words')} className={`hover:text-[var(--text-main)] ${mode === 'words' ? 'text-[var(--text-main)] font-bold' : ''}`}>Words</button>
            </div>
            
            <div className="flex gap-3 items-center border-r border-[var(--text-sub)]/20 pr-4 sm:pr-8">
              {mode === 'time' ? ([15, 30, 60, 120].map(val => ( <button key={val} onClick={() => setTimeConfig(val)} className={`hover:text-[var(--text-main)] ${timeConfig === val ? 'text-[var(--text-main)] font-bold' : ''}`}>{val}</button> ))) : ( [10, 25, 50, 100].map(val => ( <button key={val} onClick={() => setWordConfig(val)} className={`hover:text-[var(--text-main)] ${wordConfig === val ? 'text-[var(--text-main)] font-bold' : ''}`}>{val}</button> )) )}
            </div>

            {dictionaryMode === 'paragraph' && (
              <div className="flex gap-3 items-center border-r border-[var(--text-sub)]/20 pr-4 sm:pr-8">
                 <select value={selectedParagraphId} onChange={e => setSelectedParagraphId(e.target.value)} className="bg-transparent text-[var(--text-main)] outline-none border-b-2 border-[var(--text-main)] font-bold cursor-pointer py-1 max-w-[200px] truncate">
                     {PARAGRAPHS.filter(p => p.lang === language.split('_').slice(0, -1).join('_')).length === 0 ? (
                         <option disabled>No paragraphs available</option>
                     ) : (
                         PARAGRAPHS.filter(p => p.lang === language.split('_').slice(0, -1).join('_')).map(p => (
                             <option key={p.id} value={p.id} className="bg-[var(--bg-color)] text-[var(--text-color)]">{p.title}</option>
                         ))
                     )}
                 </select>
              </div>
            )}

            <div className="flex gap-3 items-center">
                 <select value={language} onChange={(e) => setLanguage(e.target.value)} className="bg-transparent text-[var(--text-main)] outline-none border-b-2 border-[var(--text-main)] font-bold cursor-pointer py-1">
                    {ALL_LANGUAGES.map(lang => (
                      <option key={lang} value={lang} className="bg-[var(--bg-color)] text-[var(--text-color)]">{lang.replace(/_/g, ' ').toUpperCase()}</option>
                    ))}
                 </select>
            </div>
          </div>
        )}

        {/* BLIND MODE SELECTOR */}
        {appMode === 'blind' && status === 'idle' && !showSettings && (
          <div className="flex flex-wrap justify-center gap-6 mb-8 p-4 bg-[var(--text-sub)]/5 rounded-2xl border border-[var(--text-sub)]/10 max-w-xl w-full">
             <div className="w-full text-center mb-2"><Headphones size={32} className="mx-auto text-[var(--text-main)] mb-2"/><p className="text-[var(--text-sub)] text-sm">Press Space or Enter to submit word.</p></div>
             <div className="flex justify-center w-full mb-4">
                 <select value={language} onChange={(e) => setLanguage(e.target.value)} className="p-3 bg-[var(--bg-color)] border border-[var(--text-sub)]/30 rounded-xl text-[var(--text-color)] font-bold outline-none focus:border-[var(--text-main)] w-full max-w-xs">
                    {ALL_LANGUAGES.map(lang => (
                      <option key={lang} value={lang}>{lang.replace(/_/g, ' ').toUpperCase()}</option>
                    ))}
                 </select>
             </div>
             <div className="flex items-center gap-4 w-full">
               <span className="text-[var(--text-sub)] text-sm font-bold w-24">TTS Speed</span>
               <input type="range" min="0.5" max="2.0" step="0.1" value={blindTTSParams.rate} onChange={(e) => setBlindTTSParams(p => ({...p, rate: parseFloat(e.target.value)}))} className="w-full accent-[var(--text-main)]" />
               <span className="text-[var(--text-main)] text-sm font-bold">{blindTTSParams.rate}x</span>
             </div>
             <button onClick={() => { startTestEnv('ready'); startTimer(); }} className="w-full py-4 bg-[var(--text-main)] text-[var(--bg-color)] rounded-xl font-bold flex justify-center items-center gap-2 hover:opacity-90"><PlayCircle/> Start Dictation</button>
          </div>
        )}

        {/* ACTIVE TYPING INTERFACES */}
        
        {appMode === 'default' && (status === 'running' || status === 'ready' || status === 'idle') && !showSettings && (
          <div className="relative mx-auto transition-all duration-300 typing-container flex flex-col items-center w-full max-w-5xl">
            <div className="flex justify-between items-center mb-6 font-bold text-[var(--text-main)] w-full" style={{ fontSize: '1.2rem' }}>
              <div>{mode === 'time' ? timeLeft : (`${activeWordIndex}/${mode === 'words' ? (dictionaryMode === 'auto' ? wordConfig : Math.min(wordConfig, words.length)) : words.length}`)}</div>
              <div className="text-[var(--text-sub)] font-medium flex gap-4" style={{ fontSize: '1rem' }}><span>WPM: {results.wpmNet || 0}</span><span>ACC: {results.accuracy || 100}%</span></div>
            </div>
            {!isReady ? (
               <div className="flex justify-center items-center h-[180px] text-[var(--text-sub)] animate-pulse w-full">Loading Engine...</div>
            ) : (
              <div className="w-full">
                 {displayMode === 'inline' ? (
                   <div ref={typingContainerRef} className="h-[200px] overflow-hidden relative select-none w-full" style={{ maskImage: 'linear-gradient(to bottom, transparent 0%, black 10%, black 80%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 10%, black 80%, transparent 100%)' }}>
                     <div className="flex flex-wrap content-start items-center relative z-0 pb-32" style={{ transform: `translateY(-${scrollOffset}px)`, transition: 'transform 0.2s ease-out' }}>
                        <div ref={caretRef} className="smooth-caret"><div className="caret-hint"></div></div>
                        {renderedWordList}
                     </div>
                     <input ref={inputRef} type="text" className="opacity-0 absolute top-0 left-0 w-1 h-1 pointer-events-none" onBlur={() => { if(status === 'running') inputRef.current?.focus() }} />
                   </div>
                 ) : (
                   <div className="w-full flex flex-col gap-6">
                     <div ref={typingContainerRef} className="h-40 overflow-hidden relative select-none w-full p-6 bg-[var(--text-sub)]/5 rounded-2xl border border-[var(--text-sub)]/20 flex flex-wrap content-start leading-relaxed text-2xl sm:text-3xl" style={{ maskImage: 'linear-gradient(to bottom, transparent 0%, black 10%, black 80%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 10%, black 80%, transparent 100%)' }}>
                        <div className="flex flex-wrap relative z-0 w-full" style={{ transform: `translateY(-${scrollOffset}px)`, transition: 'transform 0.2s ease-out' }}>
                           {renderedWordList}
                        </div>
                     </div>
                     <div className="relative w-full">
                        <input ref={inputRef} type="text" value={currentWordInput} onChange={handleInputChange} onKeyDown={handleInputKeyDown} onBlur={() => { if(status === 'running') inputRef.current?.focus() }}
                          className={`w-full p-4 sm:p-6 text-2xl sm:text-4xl text-center rounded-2xl border-4 outline-none transition-colors font-bold ${isInputError ? 'border-[var(--text-error)] text-[var(--text-error)] bg-[var(--text-error)]/5' : 'border-[var(--text-main)] text-[var(--text-main)] bg-[var(--text-main)]/5'}`}
                          placeholder="Type here..." autoComplete="off" autoCorrect="off" spellCheck="false" disabled={status === 'finished'} />
                     </div>
                   </div>
                 )}
              </div>
            )}
            <div className="w-full mt-4">{renderKeyboard()}</div>
            <div className="text-center mt-8 text-[var(--text-sub)] opacity-50 hover:opacity-100 transition-opacity w-full"><button onClick={() => startTestEnv('idle')} className="flex items-center justify-center gap-2 mx-auto hover:text-[var(--text-main)]"><RefreshCcw size={16} /> Restart</button></div>
          </div>
        )}

        {appMode === 'blind' && (status === 'running' || status === 'ready') && !showSettings && (
          <div className="relative mx-auto transition-all duration-300 typing-container flex flex-col items-center w-full max-w-3xl">
             <div className="flex justify-between items-center w-full mb-10 text-[var(--text-sub)] text-xl font-bold">
               <span>Dictation Mode</span> <span>{timeLeft}s</span>
             </div>
             
             {blindResult && (
               <div className={`text-2xl font-bold mb-4 ${blindResult.correct ? 'text-[var(--text-main)]' : 'text-[var(--text-error)]'}`}>
                 {blindResult.correct ? 'Correct!' : `Expected: ${blindResult.expected}`}
               </div>
             )}

             <div className="w-full flex items-center justify-center h-32 border-b-4 border-[var(--text-sub)]/30 text-5xl tracking-widest text-[var(--text-main)] font-mono relative">
                {blindGraphemes.map((char, i) => (
                  <span key={i} className="animate-in zoom-in duration-100">{char}</span>
                ))}
                {!blindResult && <span className="w-4 h-12 bg-[var(--text-main)] animate-pulse ml-2"></span>}
             </div>
             
             <div className="mt-8 flex gap-4 w-full justify-center">
               <button onClick={speakWordLoop} className="px-6 py-3 rounded-xl bg-[var(--text-sub)]/10 text-[var(--text-main)] font-bold flex items-center gap-2 hover:bg-[var(--text-sub)]/20"><Rewind size={20}/> Replay Audio</button>
             </div>

             <div className="w-full mt-8">{renderKeyboard()}</div>
             <div className="text-center mt-8 text-[var(--text-sub)]"><button onClick={endTest} className="hover:text-[var(--text-main)]">End Session</button></div>
          </div>
        )}

        {status === 'finished' && (
          <div className="w-full max-w-4xl mx-auto p-8 rounded-3xl bg-[var(--text-sub)]/5 border border-[var(--text-sub)]/10 shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-8 duration-500">
             <h2 className="text-3xl font-bold text-center text-[var(--text-main)] mb-10">Test Completed</h2>
             
             <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
               <div className="text-center p-4 bg-[var(--bg-color)] rounded-xl border border-[var(--text-sub)]/10 shadow-sm"><div className="text-xs text-[var(--text-sub)] font-semibold uppercase tracking-wider mb-1">Net WPM</div><div className="text-5xl font-black text-[var(--text-main)]">{results.wpmNet}</div></div>
               <div className="text-center p-4 bg-[var(--bg-color)] rounded-xl border border-[var(--text-sub)]/10 shadow-sm"><div className="text-xs text-[var(--text-sub)] font-semibold uppercase tracking-wider mb-1">Accuracy</div><div className="text-5xl font-black text-[var(--text-main)]">{results.accuracy}%</div></div>
               <div className="text-center p-4 bg-[var(--bg-color)] rounded-xl border border-[var(--text-sub)]/10 shadow-sm"><div className="text-xs text-[var(--text-sub)] font-semibold uppercase tracking-wider mb-1">Time (s)</div><div className="text-5xl font-black text-[var(--text-color)]">{results.totalTimeSeconds}</div></div>
               <div className="text-center p-4 bg-[var(--bg-color)] rounded-xl border border-[var(--text-sub)]/10 shadow-sm"><div className="text-xs text-[var(--text-sub)] font-semibold uppercase tracking-wider mb-1">Gross WPM</div><div className="text-5xl font-black text-[var(--text-color)] opacity-70">{results.wpmGross}</div></div>
             </div>

             {appMode === 'learning' && (
               <div className={`p-6 rounded-2xl mb-8 border flex items-center justify-between ${results.accuracy >= 85 ? 'bg-[var(--text-main)]/10 border-[var(--text-main)]/30' : 'bg-[var(--text-error)]/10 border-[var(--text-error)]/30'}`}>
                 <div>
                   <h3 className={`text-xl font-bold ${results.accuracy >= 85 ? 'text-[var(--text-main)]' : 'text-[var(--text-error)]'}`}>{results.accuracy >= 85 ? 'Lesson Passed!' : 'Try Again'}</h3>
                   <p className="text-[var(--text-sub)] text-sm">You need 85% accuracy to pass this lesson.</p>
                 </div>
                 {results.accuracy >= 85 && <button onClick={() => { setActiveLesson(prev => prev + 1); setTimeout(() => { startTestEnv('ready'); }, 50); }} className="px-6 py-3 bg-[var(--text-main)] text-[var(--bg-color)] font-bold rounded-lg hover:opacity-90">Next Lesson</button>}
               </div>
             )}

             <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
               <div className="flex flex-col items-center justify-center p-4 bg-[var(--text-main)]/10 rounded-xl border border-[var(--text-main)]/20"><div className="text-xs text-[var(--text-main)] font-semibold uppercase tracking-wider mb-1">Correct Keystrokes</div><div className="text-2xl font-bold text-[var(--text-main)]">{keystrokes.correct}</div></div>
               <div className="flex flex-col items-center justify-center p-4 bg-[var(--text-error)]/10 rounded-xl border border-[var(--text-error)]/20"><div className="text-xs text-[var(--text-error)] font-semibold uppercase tracking-wider mb-1">Incorrect Keystrokes</div><div className="text-2xl font-bold text-[var(--text-error)]">{keystrokes.incorrect}</div></div>
               <div className="flex flex-col items-center justify-center p-4 bg-[var(--text-sub)]/10 rounded-xl border border-[var(--text-sub)]/20"><div className="text-xs text-[var(--text-color)] font-semibold uppercase tracking-wider mb-1">Words Typed</div><div className="text-2xl font-bold text-[var(--text-color)]">{results.correctWordsCount}</div></div>
             </div>

             <div className="flex justify-center gap-4">
               {appMode === 'learning' && <button onClick={() => startTestEnv('idle')} className="px-8 py-4 bg-[var(--text-sub)]/20 text-[var(--text-color)] font-bold rounded-xl hover:bg-[var(--text-sub)]/30 transition-all">Back to Lessons</button>}
               <button onClick={() => startTestEnv(appMode === 'learning' ? 'ready' : 'idle')} className="px-8 py-4 bg-[var(--text-main)] text-[var(--bg-color)] font-bold rounded-xl hover:opacity-90 shadow-lg shadow-[var(--text-main)]/20 transition-all"><RefreshCcw size={20} className="inline mr-2" /> {appMode === 'learning' ? 'Retry Lesson' : 'Next Test'}</button>
             </div>
          </div>
        )}
      </main>

      {/* SETTINGS MODAL */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200" onClick={(e) => { if(e.target === e.currentTarget) setShowSettings(false); }}>
          <div className="bg-[var(--bg-color)] border border-[var(--text-sub)]/20 p-8 rounded-3xl w-full max-w-5xl shadow-2xl overflow-y-auto max-h-[90vh] custom-scroll">
            <div className="flex justify-between items-center mb-8 pb-4 border-b border-[var(--text-sub)]/10 sticky top-0 bg-[var(--bg-color)] z-10 pt-2">
              <h2 className="text-3xl font-bold flex items-center gap-3"><Sliders className="text-[var(--text-main)]" size={28} /> Customization Lab</h2>
              <button onClick={() => { setShowSettings(false); if(appMode !== 'home') startTestEnv(appMode === 'learning' ? 'idle' : 'idle'); }} className="p-2 hover:bg-[var(--text-sub)]/10 rounded-full transition-colors"><RefreshCcw size={24} className="rotate-45" /></button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              
              {/* DISPLAY MODE SETTINGS */}
              <div className="space-y-8">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--text-sub)] mb-4 flex items-center gap-2"><AppWindow size={16}/> Display Mode</h3>
                  <div className="flex flex-col gap-2">
                    <button onClick={() => setDisplayMode('inline')} className={`p-3 text-left rounded-xl border text-sm transition-all flex items-center gap-3 ${displayMode === 'inline' ? 'bg-[var(--text-main)]/10 border-[var(--text-main)] text-[var(--text-main)] font-semibold' : 'border-[var(--text-sub)]/20 hover:bg-[var(--text-sub)]/5'}`}>
                      <Type size={16}/> Inline (Classic)
                    </button>
                    <button onClick={() => setDisplayMode('twobox')} className={`p-3 text-left rounded-xl border text-sm transition-all flex items-center gap-3 ${displayMode === 'twobox' ? 'bg-[var(--text-main)]/10 border-[var(--text-main)] text-[var(--text-main)] font-semibold' : 'border-[var(--text-sub)]/20 hover:bg-[var(--text-sub)]/5'}`}>
                      <SquareMenu size={16}/> Two-Box (Split Input)
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--text-sub)] mb-4 flex items-center gap-2"><Type size={16}/> Font Family</h3>
                  <div className="h-40 overflow-y-auto pr-2 space-y-2 border border-[var(--text-sub)]/20 rounded-xl p-2 bg-[var(--text-sub)]/5 custom-scroll">
                    {FONTS.map(f => ( <button key={f.id} onClick={() => setFont(f)} style={{ fontFamily: f.family }} className={`w-full text-left p-3 rounded-lg text-sm transition-all ${font.id === f.id ? 'bg-[var(--text-main)] text-[var(--bg-color)] font-bold' : 'hover:bg-[var(--text-sub)]/10'}`}>{f.name}</button> ))}
                  </div>
                </div>
              </div>

              {/* DICTIONARY SETTINGS */}
              <div className="space-y-8">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--text-sub)] mb-4 flex items-center gap-2"><Keyboard size={16}/> Active Dictionary</h3>
                  <div className="relative mb-3">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-sub)]" size={16} />
                    <input type="text" placeholder="Search language (e.g. python, hindi)..." value={languageSearch} onChange={(e) => setLanguageSearch(e.target.value)} className="w-full bg-[var(--text-sub)]/10 border border-[var(--text-sub)]/20 rounded-xl py-2 pl-10 pr-4 outline-none focus:border-[var(--text-main)] text-sm text-[var(--text-color)]" />
                  </div>
                  <div className="flex flex-col gap-2 h-72 overflow-y-auto custom-scroll pr-2">
                    {ALL_LANGUAGES.filter(l => l.includes(languageSearch.toLowerCase())).map(lang => ( <button key={lang} onClick={() => setLanguage(lang)} className={`p-3 text-left rounded-xl border text-sm transition-all ${language === lang ? 'bg-[var(--text-main)]/10 border-[var(--text-main)] text-[var(--text-main)] font-semibold' : 'border-[var(--text-sub)]/20 hover:bg-[var(--text-sub)]/5'}`}>{lang.replace(/_/g, ' ').toUpperCase()}</button> ))}
                  </div>
                </div>
              </div>

              {/* AUDIO & AESTHETICS SETTINGS */}
              <div className="space-y-8">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--text-sub)] mb-4 flex items-center gap-2"><Volume2 size={16}/> Audio Synthesizer</h3>
                  <div className="grid grid-cols-2 gap-2 h-40 overflow-y-auto custom-scroll pr-2 border border-[var(--text-sub)]/20 rounded-xl p-2 bg-[var(--text-sub)]/5">
                    {SOUND_THEMES.map(themeName => ( <button key={themeName} onClick={() => {setSoundTheme(themeName); playSound(themeName, false);}} className={`p-3 text-left rounded-lg text-sm transition-all capitalize ${soundTheme === themeName ? 'bg-[var(--text-main)] text-[var(--bg-color)] font-bold' : 'hover:bg-[var(--text-sub)]/10'}`}>{themeName.replace('_', ' ')}</button> ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--text-sub)] mb-4 flex items-center gap-2"><Sun size={16}/> Aesthetics</h3>
                  <div className="grid grid-cols-2 gap-2 h-40 overflow-y-auto custom-scroll pr-2">
                    {Object.values(THEMES).map(t => ( <button key={t.id} onClick={() => setTheme(t)} className={`flex items-center gap-3 p-3 rounded-xl border text-xs transition-all ${theme.id === t.id ? 'border-[var(--text-main)] ring-1 ring-[var(--text-main)] font-semibold' : 'border-transparent hover:bg-[var(--text-sub)]/5'}`} style={{ backgroundColor: t.bg, color: t.text }}><div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: t.main }}></div> {t.name}</button> ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10 flex justify-end sticky bottom-0 bg-[var(--bg-color)] py-4 border-t border-[var(--text-sub)]/10">
               <button onClick={() => { setShowSettings(false); if(appMode !== 'home') startTestEnv(appMode === 'learning' ? 'idle' : 'idle'); }} className="px-8 py-3 bg-[var(--text-main)] text-[var(--bg-color)] rounded-xl font-bold shadow-lg hover:opacity-90 transition-opacity">Apply Settings</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}