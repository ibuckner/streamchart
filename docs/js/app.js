let json = {
  labels: {
    series: ["item1", "item2", "item3", "item4", "item5", "item6", "item7", "item8"],
    xaxis: "year"
  },
  series: [
    { label: "1880", values: [241,0,117,12,112,636,27,0] },
    { label: "1881", values: [263,0,112,14,109,612,38,0] },
    { label: "1882", values: [288,0,123,15,115,838,36,0] },
    { label: "1883", values: [287,0,120,16,141,862,49,0] },
    { label: "1884", values: [337,0,144,13,163,986,33,6] },
    { label: "1885", values: [339,0,155,10,196,1134,60,5] },
    { label: "1886", values: [370,0,167,10,230,1267,49,8] },
    { label: "1887", values: [338,0,178,15,272,1405,50,10] },
    { label: "1888", values: [404,0,214,26,373,1847,77,12] },
    { label: "1889", values: [413,0,189,12,377,1909,74,17] },
    { label: "1890", values: [392,0,216,24,458,2312,54,11] },
    { label: "1891", values: [371,0,239,15,566,2417,78,12] },
    { label: "1892", values: [455,0,255,16,626,2936,83,21] },
    { label: "1893", values: [387,0,298,24,821,3249,82,28] },
    { label: "1894", values: [418,0,298,18,1052,3676,94,36] },
    { label: "1895", values: [431,0,350,13,1127,4023,96,35] },
    { label: "1896", values: [367,0,342,18,1366,4392,104,37] },
    { label: "1897", values: [354,0,367,23,1472,4519,81,49] },
    { label: "1898", values: [371,0,421,21,1671,5230,102,47] },
    { label: "1899", values: [326,0,410,11,1687,5048,98,56] },
    { label: "1900", values: [377,0,664,26,2491,6343,126,89] },
    { label: "1901", values: [317,0,474,21,2173,5247,86,68] },
    { label: "1902", values: [301,0,580,21,2707,5967,91,85] },
    { label: "1903", values: [247,0,596,21,3078,6129,90,79] },
    { label: "1904", values: [294,0,707,23,3477,6488,101,124] },
    { label: "1905", values: [311,0,807,18,3937,6811,106,121] },
    { label: "1906", values: [260,0,865,25,4326,7176,98,157] },
    { label: "1907", values: [285,0,1018,21,4967,7579,102,177] },
    { label: "1908", values: [260,0,1128,25,5703,8439,93,205] },
    { label: "1909", values: [271,0,1082,26,6253,9250,105,233] },
    { label: "1910", values: [278,0,1389,33,7318,10479,137,316] },
    { label: "1911", values: [280,0,1456,36,8869,11802,130,325] },
    { label: "1912", values: [310,0,2011,32,12645,16133,189,504] },
    { label: "1913", values: [346,0,2239,42,14674,18889,238,588] },
    { label: "1914", values: [375,0,2933,62,18782,23221,219,656] },
    { label: "1915", values: [412,0,4182,106,25154,30866,290,895] },
    { label: "1916", values: [421,0,5136,90,27415,32661,297,1078] },
    { label: "1917", values: [445,5,6639,89,28853,34249,291,1441] },
    { label: "1918", values: [397,0,8802,92,32034,36150,322,1760] },
    { label: "1919", values: [379,0,10107,70,31734,33705,282,2144] },
    { label: "1920", values: [379,0,14017,82,36645,35098,349,2502] },
    { label: "1921", values: [392,0,17637,94,39083,34819,367,3382] },
    { label: "1922", values: [341,0,20893,71,37711,32507,365,3902] },
    { label: "1923", values: [362,0,25990,118,39045,31492,423,4800] },
    { label: "1924", values: [341,0,30602,125,39996,31193,454,6958] },
    { label: "1925", values: [310,0,32817,82,38572,29168,438,8095] },
    { label: "1926", values: [310,0,32959,116,36614,26884,479,8590] },
    { label: "1927", values: [234,0,35422,91,35987,25316,516,10553] },
    { label: "1928", values: [247,0,36078,130,33728,22936,554,12332] },
    { label: "1929", values: [209,0,36669,161,31477,20983,509,13626] },
    { label: "1930", values: [196,0,38239,165,30404,19914,493,15749] },
    { label: "1931", values: [209,0,36102,158,26521,17657,534,16468] },
    { label: "1932", values: [213,0,34411,208,24968,16375,774,17991] },
    { label: "1933", values: [199,0,31526,243,22050,14645,786,18625] },
    { label: "1934", values: [189,0,31078,280,21280,14099,1001,20847] },
    { label: "1935", values: [211,0,28673,279,19400,12778,1197,22876] },
    { label: "1936", values: [192,0,25863,299,17668,12232,2439,23912] },
    { label: "1937", values: [176,0,25328,323,16571,11452,4380,26837] },
    { label: "1938", values: [192,7,25502,410,16348,10833,7047,27555] },
    { label: "1939", values: [185,0,23639,443,15170,10417,10714,29704] },
    { label: "1940", values: [218,0,22074,469,14874,10201,18368,32661] },
    { label: "1941", values: [223,6,20900,608,14561,9889,23715,36901] },
    { label: "1942", values: [295,8,21654,676,15032,10013,31611,39454] },
    { label: "1943", values: [284,10,21595,788,14785,9799,38437,39620] },
    { label: "1944", values: [238,12,19757,1293,13378,8693,38411,36872] },
    { label: "1945", values: [280,10,18383,1464,12328,8300,41464,35840] },
    { label: "1946", values: [274,7,19714,2470,12796,8852,52708,46295] },
    { label: "1947", values: [310,11,18962,5838,12751,8978,99680,51274] },
    { label: "1948", values: [306,13,16622,11246,11326,8305,96211,46135] },
    { label: "1949", values: [333,11,14946,19208,10406,7709,91010,46337] },
    { label: "1950", values: [379,15,13614,29073,9555,7060,80439,47952] },
    { label: "1951", values: [409,15,12820,42045,9082,6945,73947,56433] },
    { label: "1952", values: [418,24,12125,49809,8608,6470,67092,53090] },
    { label: "1953", values: [428,15,11367,52196,8154,6120,61264,51007] },
    { label: "1954", values: [428,21,10615,54674,7791,5940,55371,49133] },
    { label: "1955", values: [452,8,9928,52314,7241,5596,51279,46210] },
    { label: "1956", values: [643,25,9213,47829,6862,5279,48067,43332] },
    { label: "1957", values: [667,27,8474,40065,6401,5015,44495,39277] },
    { label: "1958", values: [796,38,7709,32936,5539,4763,41898,37932] },
    { label: "1959", values: [858,37,7317,29552,5238,4378,40409,35221] },
    { label: "1960", values: [977,57,6503,25269,5077,4069,37314,32107] },
    { label: "1961", values: [1057,80,5580,24092,4726,3855,35574,28867] },
    { label: "1962", values: [948,95,4765,22893,4075,3587,31462,26538] },
    { label: "1963", values: [1035,108,4154,21062,3791,3340,27715,25363] },
    { label: "1964", values: [1275,180,4067,19306,3535,3095,23633,26087] },
    { label: "1965", values: [1650,218,3565,17083,2960,2804,19339,23551] },
    { label: "1966", values: [2329,263,2948,16250,2667,2449,15560,20115] },
    { label: "1967", values: [2663,386,2543,14007,2316,2153,13199,17746] },
    { label: "1968", values: [2430,544,2134,12286,2084,1881,11368,15806] },
    { label: "1969", values: [2817,643,2133,11186,1778,1857,10248,14957] },
    { label: "1970", values: [3550,932,1967,9853,1802,1715,8734,13404] },
    { label: "1971", values: [4133,1164,1763,8675,1626,1441,7379,11466] },
    { label: "1972", values: [4181,1176,1366,6279,1277,1245,5746,9602] },
    { label: "1973", values: [5627,1253,1323,4984,1175,1133,4735,8477] },
    { label: "1974", values: [7476,1626,1130,4345,1100,1140,4085,8040] },
    { label: "1975", values: [12653,1988,1021,3415,975,1057,3525,7056] },
    { label: "1976", values: [15591,2292,908,2994,983,942,3141,6017] },
    { label: "1977", values: [18280,2706,807,2677,934,992,2909,5907] },
    { label: "1978", values: [20522,3484,715,2479,913,922,2936,5498] },
    { label: "1979", values: [31927,4450,711,2181,889,879,2739,5651] },
    { label: "1980", values: [35819,7296,658,1938,895,909,2805,5309] },
    { label: "1981", values: [34373,8877,662,1905,787,896,2730,5285] },
    { label: "1982", values: [34210,14851,635,1842,828,875,2787,5167] },
    { label: "1983", values: [33754,33290,563,1605,759,844,2473,4922] },
    { label: "1984", values: [33906,38759,503,1468,682,859,2334,4475] },
    { label: "1985", values: [39050,47007,502,1401,719,809,2113,4398] },
    { label: "1986", values: [40522,49674,407,1284,629,766,1951,4246] },
    { label: "1987", values: [41786,54845,435,1203,614,815,1929,3913] },
    { label: "1988", values: [39451,49963,395,1056,608,775,1844,3798] },
    { label: "1989", values: [36827,47585,399,1076,620,857,1844,3606] },
    { label: "1990", values: [34405,45553,406,1094,596,861,1658,3578] },
    { label: "1991", values: [28887,43482,345,1014,498,773,1608,3418] },
    { label: "1992", values: [25034,38452,296,919,508,827,1580,2951] },
    { label: "1993", values: [20809,34847,292,797,476,868,1487,2660] },
    { label: "1994", values: [18715,30278,275,740,442,848,1281,2363] },
    { label: "1995", values: [16345,26603,234,660,376,837,1233,2160] },
    { label: "1996", values: [13973,23676,217,633,350,900,987,1970] },
    { label: "1997", values: [12239,20895,189,638,315,812,1095,1781] },
    { label: "1998", values: [10908,19871,194,553,312,832,970,1704] },
    { label: "1999", values: [11999,19741,182,524,335,841,898,1532] },
    { label: "2000", values: [8550,17997,174,545,312,890,849,1392] },
    { label: "2001", values: [6963,16524,153,489,317,884,837,1223] },
    { label: "2002", values: [6132,15339,127,474,263,875,769,1113] },
    { label: "2003", values: [5339,14512,142,421,291,783,739,1011] },
    { label: "2004", values: [4677,14370,136,427,288,860,727,997] },
    { label: "2005", values: [4088,13270,132,425,234,960,745,877] },
    { label: "2006", values: [3355,12340,135,423,265,948,698,775] },
    { label: "2007", values: [3038,11423,134,371,262,931,659,725] },
    { label: "2008", values: [2439,9402,137,355,242,884,611,629] },
    { label: "2009", values: [1952,7811,148,346,226,826,550,564] },
    { label: "2010", values: [1655,6306,132,354,240,703,476,479] },
    { label: "2011", values: [1409,5398,167,332,276,729,488,427] },
    { label: "2012", values: [1228,4696,140,336,277,772,448,394] },
    { label: "2013", values: [1064,3936,174,329,334,738,441,419] },
    { label: "2014", values: [1048,3547,193,369,382,801,470,377] },
    { label: "2015", values: [1013,3409,186,346,395,757,423,346] }
  ]
};

const App = function() {
  function start () {
    page();
    menu();

    const streamchart = new chart.Streamchart({
      container: document.getElementById("chart"),
      data: json,
      margin: { bottom: 30, left: 30, right: 10, top: 10 }
    });

    streamchart.draw();
  }

  function menu() {
    const menu = document.querySelector(".menu");
    const menuButton = document.querySelector(".menu-button");

    if (menu && menuButton) {
      menuButton.addEventListener("click", function(e) {
        e.stopImmediatePropagation();
        menu.classList.toggle("ready");
      });
      menu.addEventListener("click", function(e) { e.stopImmediatePropagation(); });
    }
    window.addEventListener("hide-menu", function() { menu.classList.add("ready"); });
  }

  function page() {
    const chart = document.getElementById("chart");

    chart.addEventListener("click", function() {
      window.dispatchEvent(new CustomEvent("hide-menu"));
    });

    window.addEventListener("stream-selected", function(e) {
      console.log(e.detail.id + " was selected.");
    });
  }

  App.start = start;

  return App;
};
