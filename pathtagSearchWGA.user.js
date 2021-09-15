// ==UserScript==
// @name         Pathtags Wishlist Tag Search - WGA Members
// @namespace    https://github.com/cjstolte/pathtag-wishlist-search
// @description  Adds a button to the wishlist fulfillment page to search for the provided list of wanted pathtags.
// @author       cjstolte
// @supportURL   https://github.com/cjstolte/pathtag-wishlist-search/issues
// @homepageURL  https://github.com/cjstolte/pathtag-wishlist-search/
// @iconURL      https://raw.githubusercontent.com/cjstolte/pathtag-wishlist-search/main/pathtags.ico

// @updateURL    https://github.com/cjstolte/pathtag-wishlist-search/blob/main/pathtagSearchWGA.user.js
// @downloadURL  https://github.com/cjstolte/pathtag-wishlist-search/blob/main/pathtagSearchWGA.user.js
// @version      1.0.1


// @include      https://*pathtags.com/community/fulfillwish.php*
// @run-at       document-end
// @require      https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant        GM_getValue
// @grant        GM_setValue
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('load', function() {

        setupGMConfig();

        var x = document.body.innerHTML;
        document.body.innerHTML = x.replace("Fulfill a Wish For Template", "<div id='cjstolteWLSearch' style='background-color:#1E62A1;color:#FF0000;width: 300px;margin-left: 95px;padding-top: 5px;padding-bottom: 5px;'><div id='wlSearchTitle' style='text-align:center'>Pathtag Wishlist Search</div><div id='wlSearchDiv' style='cursor:pointer;'>Search</div><div id='wlSearchSettings' style='cursor:pointer;'>Settings</div></div> Fulfill a Wish For Template");

        var myDiv = document.querySelector("#wlSearchDiv");
        if (myDiv) {
            myDiv.addEventListener("click", searchForTags , false);
        }

        var wlSettingsDiv = document.querySelector("#wlSearchSettings");
        if (wlSettingsDiv) {
            wlSettingsDiv.addEventListener("click", openWLUserConfig);
        }

    }, false);



})();

function setupGMConfig() {
    GM_config.init({
        'id': 'wlUserConfig',
        'title': 'Pathtag Wishlist Tag Search Settings',
        'fields':
        {
            'wlsWGASectionHeader':
            {
                'section': ['WGA User Tag Search Settings','Add just tags to these settings to search for WGA User Pathtags. This way it\'s seperated from your other desired tags'],
                'type': 'hidden',
                'value': 'sectionHeader'
            },
            'wlsWGAIds':
            {
                'label': 'List of Pathtag ID\'s:',
                'type': 'text',
                'size': '100',
                'title': 'Provide list of tag #\'s seperated by commas \',\'',
                'default': defaultWGAsearchListIds
            },
            'wlsWGAIdsIncludeCollection':
            {
                'label': 'Include tags already in your collection with WGA ID Search',
                'type': 'checkbox',
                'default': false
            },
            'wlsWGAUsernames':
            {
                'label': 'List of Pathtag Usernames:',
                'type': 'text',
                'size': '100',
                'title': 'Provide list of Pathtag usernames seperate by commas \',\'',
                'default': defaultWGAsearchListUsername
            },
            'wlsWGAUsernamesIncludeCollection':
            {
                'label': 'Include tags already in your collection with WGA Username Search',
                'type': 'checkbox',
                'default': false
            },
            'wlsOtherSectionHeader':
            {
                'section': ['Settings to search for other desired tags', 'Add other tags you are on the lookout for and don\'t want mixed in with the WGA search'],
                'type': 'hidden',
                'value': 'sectionHeader'
            },
            'wlsOtherSearch':
            {
                'label': 'List of Pathtag ID\'s and Usernames:',
                'type': 'text',
                'size': '100',
                'title': 'Provide list of Pathtag Tag ID\'s and usernames seperate by commas \',\'',
                'default': defaultOtherWantsIdsAndUsername
            },
            'wlsOtherIncludeCollection':
            {
                'label': 'Include tags already in your collection with Other Tags Search',
                'type': 'checkbox',
                'default': false
            },
        }
    });
}

function openWLUserConfig() {
    GM_config.open();
}


function searchForTags() {
    // Update variables from settings
    var includeAlreadyInCollectionWGAIds = GM_config.get('wlsWGAIdsIncludeCollection');
    var includeAlreadyInCollectionWGAUsername = GM_config.get('wlsWGAUsernamesIncludeCollection');
    var includeAlreadyInCollectionOther = GM_config.get('wlsOtherIncludeCollection');

    var WGAsearchListIds = GM_config.get('wlsWGAIds');
    var WGAsearchListUsername = GM_config.get('wlsWGAUsernames');
    var otherWantsIdsAndUsername = GM_config.get('wlsOtherSearch');

    var WGAsearchListIdsArr = WGAsearchListIds.split(',');
    var WGAsearchListUsernameArr = WGAsearchListUsername.split(',');
    var otherWantsIdsAndUsernameArr = otherWantsIdsAndUsername.split(',');

	var WGAIdsFoundArray = [];
	var WGAUsernameFoundArray = [];
	var foundOtherArray = [];

	var notInCollectionIds = [];
	var inCollectionIds = [];
	var notInCollectionBy = [];
	var inCollectionBy = [];

	var notInCollElementsArr = document.getElementsByClassName(notInCollectionClass);
	var inCollElementsArr = document.getElementsByClassName(inMyCollectionClass);

	/*********************************
	** Extract Page tag information **
	**********************************/

	for (var i = 0; i < notInCollElementsArr.length; i++)
	{
		// Extract all Tag IDS not in current collection on page
		notInCollectionIds.push(notInCollElementsArr[i].getElementsByClassName(tagIdLinkClass)[0].innerHTML.substring(6).trim());

		// Extract tag creator
		notInCollectionBy.push(notInCollElementsArr[i].getElementsByClassName("by")[0].getElementsByTagName("a")[0].innerHTML);
	}

	// Extact info for tags in current collection
	for (var j = 0; j < inCollElementsArr.length; j++)
	{
		// Extract all Tag IDS in current collection on page
		inCollectionIds.push(inCollElementsArr[j].getElementsByClassName(tagIdLinkClass)[0].innerHTML.substring(6).trim());

		// Extract tag creator
		inCollectionBy.push(inCollElementsArr[j].getElementsByClassName("by")[0].getElementsByTagName("a")[0].innerHTML);
	}



	/* **********************
	** Search for the Tags **
	*************************/

	for (var k = 0; k < WGAsearchListIdsArr.length; k++)
	{
		if (notInCollectionIds.includes(WGAsearchListIdsArr[k])) {
			WGAIdsFoundArray.push(WGAsearchListIdsArr[k]);
		}

		if (includeAlreadyInCollectionWGAIds) {
			if (inCollectionIds.includes(WGAsearchListIdsArr[k])) {
				WGAIdsFoundArray.push(WGAsearchListIdsArr[k]);
			}
		}
	}

	for (var m = 0; m < WGAsearchListUsernameArr.length; m++)
	{
		if (notInCollectionBy.includes(WGAsearchListUsernameArr[m])) {
			WGAUsernameFoundArray.push(WGAsearchListUsernameArr[m]);
		}

		if (includeAlreadyInCollectionWGAUsername) {
			if (inCollectionBy.includes(WGAsearchListUsernameArr[m])) {
				WGAUsernameFoundArray.push(WGAsearchListUsernameArr[m]);
			}
		}
	}

	for (var n = 0; n < otherWantsIdsAndUsernameArr.length; n++)
	{
		if (notInCollectionIds.includes(otherWantsIdsAndUsernameArr[n]) || notInCollectionBy.includes(otherWantsIdsAndUsernameArr[n])) {
			foundOtherArray.push(otherWantsIdsAndUsernameArr[n]);
		}

		if (includeAlreadyInCollectionOther) {
			if (inCollectionIds.includes(otherWantsIdsAndUsernameArr[n]) || inCollectionBy.includes(otherWantsIdsAndUsernameArr[n])) {
				foundOtherArray.push(otherWantsIdsAndUsernameArr[n]);
			}
		}
	}

	/* ******************
	** Display Results **
	*********************/

	if (WGAIdsFoundArray.length > 0) {
		alert("WGA IDs: " + WGAIdsFoundArray);
	} else {
		alert("No WGA Pathtags found via IDs")
	}

	if (WGAUsernameFoundArray.length > 0) {
        var uniqueWGAUsernameResults = [...new Set(WGAUsernameFoundArray)];
		alert("WGA Usernames: " + uniqueWGAUsernameResults);
	} else {
		alert("No WGA Pathtags found via Usernames")
	}

	if (foundOtherArray.length > 0) {
        var uniqueOtherResults = [...new Set(foundOtherArray)];
		alert("Other tags: " + uniqueOtherResults);
	} else {
		alert("No wanted tags found")
	}


	console.log(WGAIdsFoundArray);
	console.log(WGAUsernameFoundArray);
	console.log(foundOtherArray);
}

/***********************************
************************************
***** DO NOT MODIFY BELOW HERE *****
************************************
************************************/

// Script Required Variables here:
var allTagsClass = "alltags";
var notInCollectionClass = "wl_notinmycollection";
var inMyCollectionClass = "wl_inmycollection";
var tagIdLinkClass = "tagid";
var tagCreatorClass = "by";

var defaultWGAsearchListIds = "4862,5128,5159,5160,5456,5512,5568,5583,5591,5594,5609,5860,5923,6001,6350,6373,6476,6475,6428,6523,6524,6551,6792,6935,7026,7037,7058,7264,7287,7323,7434,7503,7522,7689,7804,7962,7963,7980,8040,8327,8334,8630,8764,8836,8943,9014,9217,9224,9314,9338,9377,9531,9619,9785,9820,9821,9825,9878,9904,10116,10151,10160,10273,10357,10379,10435,10436,10441,10587,10600,10638,10906,10940,10984,11036,11040,11053,11187,11238,11256,11257,11306,11419,11421,11484,11597,11628,11700,11768,11769,11770,11909,11910,11911,12020,12105,12106,12147,12334,12663,12664,12665,12768,12817,12819,12821,12840,12927,13134,13135,13177,13190,13331,13343,13377,13421,13646,13712,13721,13730,14105,14242,14401,14402,14503,14542,14626,14629,14675,14711,14786,14868,14959,15269,15277,15292,15315,15410,15442,15528,15674,15675,15782,15811,15824,15887,15976,16020,16076,16080,16082,16083,16112,16140,16163,16332,16381,16446,16530,16602,16759,16781,16784,16836,16847,16873,16957,17044,17135,17201,17246,17290,17417,17426,17427,17473,17478,17603,17607,17737,17820,17927,18005,18035,18111,18155,18221,18271,18413,18414,18502,18518,18656,18763,18981,19102,19145,19212,19279,19280,19328,19620,19642,20024,20025,20042,20060,20088,20533,20567,20592,21090,21165,21214,21225,21262,21885,22037,22266,22376,22606,22621,22806,22857,23042,23177,23237,23777,24261,24443,24509,24599,24718,24729,25035,25042,25059,25274,25315,25316,25438,25511,25600,25704,25745,26038,26054,26056,26314,26511,26514,26538,26554,26956,26971,27390,27528,28260,28434,28435,28841,29026,29448,29642,30080,30472,30516,30601,30758,30827,31048,31294,31665,31753,31872,31918,31920,32057,32156,32560,32878,32968,32969,32979,33059,33190,33450,34043,34249,34405,34407,34595,35495,35496,35524,35865,35974,36110,36457,36537,36786,36819,37062,37130,37295,37321,37751,37752,37860,37876,37879,37945,38078,38079,38136,38242,38408,38490,38491,38630,38780,38987,39101,39175,39210,39311,39385,39571,39572,39573,39667,39686,39688,39918,39919,40008,40110,40112,40198,40453,40967,40968,41130,41186,41229,41232,41236,41925,41928,42083,42205,42215,42248,42513,42531,42555,42706,42895,43123,43143,43593,43609,43701,43801,44020,44020,44132,44219,44236,44291,44347,44539,44659,44939,44942,45021,45049,45079,45091,45112,45146,45180,45203,45249,45279,45289,45305,45362,45447,45487,45516,45563,45597,45612,45628,45629,45658,45674,45790,45853,45927,46022,46032,46046,46067,46096,46258,46310,46366,46382,46430,46522,46583,46617,46689,46718,46726,46938,46944,47025,47067,47094,47245,47344,47483,47523,47534,47588,47661,47711,47730,47849,47912,47938,47955,47982,47996,48036,48053,48057,48068,48104,48107,48210,48235,48249,48250,48261,48330,48336,48377,48449,48523,48566,48576,48607,48666,48690,48737,48788,48789,48801,48927,48958,49016,49061,49305,49157,49199,49221,49408,49464,49495,49574,49673,49706,49769,49840,49942,49991,50023,50024,50261";
var defaultWGAsearchListUsername = "ACME_Wildcachers,AnotherCrafter,ArtguyBill,AstroD-Team,AuntieNae,Averith,benny7210,B-Jules,blue_cougar54494,BrillO17,BSA Potawatimi,Potawatomi Area Council, BSA,buttersfamily89,Cache_boppin_BunnyFuFu,CacheARRRS,Cartmanraxter,CaseysPeeps,cgutzmer,chewysfolks,Christmasguy,Curly Girls,djwini,Dog and Me,donb01,Dragonmar,DragonReborn09,Dreamcatchr,dseer,Famof5W,Ferret101,FindrzKeeprz,Fox Valley Geocachers,Froggerz,Gary-Dawn,Geocaching Widow,GeoKatzen,goirish75,Team Black-cat,Go Irish75,GR8 EYES,GreendaleSRT4,greyhounder,Hack1of2,HamFam,Icy Paws,imjedi,jahnfamily,jbase,Jcee,JeepDBC,jks1033,JMGully,jmj-wi,Juel_Beer,k0rpl & greyhounder,k9zp,kaysmom&kay,kaysmom,King54130,kmhiker,Love2Labs/kmhiker,kungfuhippie,labgal13,labzone,Lacknothing,LadyMystis,LandowskiFamily,Ldove,Lobsters9494,lostcheq,luckyastrodiver,MASKinWI,MavWitt,MCJ_r_Us,messa,MikMac 4,Mindfree,Mister Greenthumb,mmswift,Momtaineer,Mos Eisley Pirates,MrsJonesen,MTCLMBR,n9wvd,Nate_USA,newnanny,opps5,Orion's Glow,Pair-o-keets,Pharmteam,Pipalini,polkajen,Polycron,Pulda1,Ranger Boy,raslas,rawevil,rcflyer2242 & Wingwalkers,RJ McKenzie,Rocketmac,rogo63surveyor,RSQME1,SammyClaws,Scooter2010,Scottdamnit,Scribble Scribe,Silyngufy,Sunshine,Superior Loon,Sweetlife,Tarz,TC54915,Team BearMoose,Team Black-Cat,Team Rusch,Team Sandman,Team Thomsen,Team Zeevil,Team~DNF,The Crippler,The Goldie Diggers,The Searchers,The Tapps Jr,The Tapps,the5blues,ThePharmGirl,Timberline Echos,TMY,Uncle Fun,uws22,Videochic,Wandering Tracks,WI Harley Couple,Wiskey33,Yawningdog,youngins3,zeeman_clan,Zemmy,SgtCoz,RangerBoy,kthoms0319,BillT";
var defaultOtherWantsIdsAndUsername = "1000,2000";