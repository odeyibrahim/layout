/* Wording for new pages, by industry. Add yours here. */
export const IND={
general:{label:"General",tag:"Made with care",post:"Say it with care.",story:"Now open.",quote:"A short line your customers will remember.",flyer:"Big news.",cta:"Tap to find out more",i:["Item one","Item two","Item three"]},
fashion:{label:"Fashion & styling",tag:"Cut for contrast.",post:"New season, new you.",story:"Just landed.",quote:"Style is a way to say who you are without speaking.",flyer:"Private sale.",cta:"Tap to shop the edit",i:["The signature piece","Styling session","Alterations"]},
food:{label:"Food & restaurant",tag:"Fresh, every day.",post:"Made fresh today.",story:"Table for two?",quote:"Good food is the shortest road to happiness.",flyer:"Join us this weekend.",cta:"Tap to book a table",i:["Chef’s starter","House main","Dessert of the day"]},
beauty:{label:"Beauty & wellness",tag:"Glow with intent.",post:"Treat yourself.",story:"Book your glow.",quote:"Beauty begins the moment you decide to be yourself.",flyer:"New treatments.",cta:"Tap to book now",i:["Signature facial","Manicure","Full-body massage"]},
property:{label:"Real estate",tag:"Find your place.",post:"Just listed.",story:"Open house.",quote:"Home is where the story starts.",flyer:"Open house this Saturday.",cta:"Tap to view the listing",i:["Viewing fee","Valuation","Management fee"]},
consulting:{label:"Consulting & services",tag:"Clear advice. Real results.",post:"Clarity wins.",story:"Let’s talk.",quote:"Good strategy is simple enough to act on today.",flyer:"Free discovery call.",cta:"Tap to book a call",i:["Discovery session","Strategy workshop","Monthly retainer"]},
art:{label:"Art & gallery",tag:"Credit the maker. Name the place.",post:"New to the house.",story:"Viewing this week.",quote:"Borrowing is not belonging.",flyer:"Private viewing.",cta:"Tap to enquire",i:["Original work","Framing","Delivery and hanging"]}};
export const copy=b=>IND[b&&b.ind]||IND.general;
