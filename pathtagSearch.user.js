// ==UserScript==
// @name         Pathtags Wishlist Tag Search
// @namespace    https://github.com/cjstolte/pathtag-wishlist-search
// @description  Adds a button to the wishlist fulfillment page to search for the provided list of wanted pathtags.
// @author       cjstolte
// @supportURL   https://github.com/cjstolte/pathtag-wishlist-search/issues
// @homepageURL  https://github.com/cjstolte/pathtag-wishlist-search/
// @iconURL      https://raw.githubusercontent.com/cjstolte/pathtag-wishlist-search/main/pathtags.ico

// @updateURL    https://github.com/cjstolte/pathtag-wishlist-search/blob/main/pathtagSearch.user.js
// @downloadURL  https://github.com/cjstolte/pathtag-wishlist-search/blob/main/pathtagSearch.user.js
// @version      0.1


// @include      https://*pathtags.com/community/fulfillwish.php*
// @run-at       document-end
// @grant        none
// ==/UserScript==


var WGAsearchList = "5512,5568,5594,5609,5923,6001,6373,6523,6524,7037,7323,7434,7804,8836,9014,9619,9785,10116,10160,10273,10379,10435,10436,10940,11700,12334,12601,12602,12603,12604,12605,12817,12819,12821,12840,12927,13190,13712,13730,14503,14629,14675,15292,15410,15782,15811,15824,15976,16112,16381,16530,16957,17003,17135,17201,17417,17607,17737,18035,18111,18221,18656,18862,19145,19262,19279,19620,20060,20088,20161,20425,20533,21090,22209,22621,22857,23042,23177,23237,23777,24261,24509,24599,24718,25199,25315,25511,25600,25704,26038,26054,26056,26314,26511,26538,26956,27390,27528,27626,28434,29704,30080,30472,30601,30827,31294,31753,31782,31789,31872,32560,32878,33450,34043,35811,36457,37062,37295,37945,38491,38630,38780,38802,39175,39385,39667,40198,41130,41186,41236,42083,42215,42248,42706,42895,43593,43801,44132,44219,44291,44539,44939,45157,45289,46022,46046,46096,46337,47044,47245,47483,47523,47588,47996,48104,48210,48235,48336,48523,48576,48958,48962,49199,49305,49464,49574,49706,49769,49840,AstroD-Team,B-Jules,BSA Potawatimi,Potawatomi Area Council,CacheARRRS,Cache_boppin_BunnyFuFu,Cartmanraxter,cgutzmer,chewysfolks,djwini,Dog and Me,dseer,Geocaching Widow,Widow,GeoKatzen,Team Black-cat,Team Black-Cat,ham fam,jbase,Jcee,JMGULLY,kaysmom,LadyMystis,LandowskiFamily,Lobsters9494,MCJ_r_Us,MikMac4,Mindfree,Mister Greenthumb,Mos Eisley Pirates,Nate_USA,pharmteam,Pharmteam,Pipalini,Potawatomi,Pulda1,RangerBoy,rcflyer2242,RJ McKenzie,Rocketmac,rogo63surveyor,Scottdamnit,Silyngufy,Sunshine,sweetlife,sweetlife-All Gone,Tarz,Team BearMoose,Team~DNF,teamrusch,The Goldie Diggers,The Tapps Jr,the5blues,uws22,Videochic,zeemanclan,BillT";
var WGAsearchArray = WGAsearchList.split(',');
var otherWants = "36895,36621,34280,22944,36936,3841437652,5523,21987,39622,18862,39423,37976,20342,5512,45598,45555,45535,45522,45424,45380,45338,45330,45337,45138,45107,44970,44966,44793,44711,44671,5033,5202,2328,5344,5362,5385,5395,5492,5500,5520,5568,5571,5594,5669,5751,5783,5797,5915,5923,6001,12585,12434,12334,12282,11902,10940,10169,9610,9319,8361,8355,7845,7690,7442,7323,7279,7138,6373,6266,6255,6226,17323,17076,14439,14421,13377,13285,13029,13015,12968,25481,25357,25100,24682,24246,23926,23379,22944,22767,22615,22328,21992,21987,21582,21234,20991,20785,20102,19884,19620,19324,18461,18384,34280,34255,34238,34222,34115,34112,33246,32911,32599,32425,30625,30107,29927,29816,29680,29416,28397,28128,27634,27567,27419,26879,26314,25896,25866,25688,36130,35859,35827,35497,35464,35272,35255,35254,35190,35168,35154,35065,34911,34847,34816,34783,34725,34708,34667,34660,34656,34639,34563,34562,34517,34504,34465,34426,34417,38523,38521,38492,38471,38441,38414,38376,38294,38276,38182,38039,37812,37770,37719,37652,37499,37310,37309,37286,37244,37142,37139,37130,37053,37039,36938,36936,36690,36621,36265,39728,39681,39622,39612,39597,39588,39552,39550,39536,39522,39435,39340,39113,39037,39030,39005,38933,38837,38706,38675,38660,38544,39914,40043,40198,41829,43350,38492,38441,38320,38055,38032,11515,11515,38303,37815,37888,37993,37973,37975,37976,38066,38032,38040,38051,38088,38259,38166,38180,38181,38182,38198,38232,38243,38320,38340,38600,38441,38517,38894";
var otherWantArray = otherWants.split(',');

(function() {
    'use strict';

    window.addEventListener('load', function() {
        var x = document.body.innerHTML;
        document.body.innerHTML = x.replace("Fulfill a Wish For Template", "<div id='searchDiv' style='cursor:pointer'>Search</div> Fulfill a Wish For Template");

        var myDiv = document.querySelector ("#searchDiv");
        if (myDiv) {
            myDiv.addEventListener ("click", searchForTags , false);
        }

    }, false);



})();

function searchForTags() {
            
            var WGAfoundArray = [];
            var foundOtherArray = [];

            var x = document.body.innerHTML;

            for(var i = 0; i < WGAsearchArray.length; i++)
            {
                if (x.match("Tag # " + WGAsearchArray[i] + "</a>") != null || x.toLowerCase().match(WGAsearchArray[i].toLowerCase() + "</a>") != null)
                {
                    WGAfoundArray.push(WGAsearchArray[i]);
                }
            }

            for(var j = 0; j < otherWantArray.length; j++)
            {
                if (x.match("Tag # " + otherWantArray[j] + "</a>") != null || x.match(otherWantArray[j] + "</a>") != null)
                {
                    foundOtherArray.push(otherWantArray[j]);
                }
            }

            if (WGAfoundArray.length > 0){
                alert("WGA: " + WGAfoundArray);
            } else {
                alert("No WGA Found");
            }

    if (foundOtherArray.length > 0){
                alert("Other: " + foundOtherArray);
            } else {
                alert("No Others Found");
            }

            console.log(WGAfoundArray);
    console.log(foundOtherArray);
        }