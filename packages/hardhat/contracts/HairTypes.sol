//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

contract HairTypes{
    struct H {
        string code;
        string traitType;
        string trait;
    }

    string t = "hair-top";
    string b = "hair-bangs";
    string l = "hair-back";

    H topPlain = H(
        string(abi.encodePacked(
            '<g id="hair-top-plain">',
            '<path d="m146.75427,35.26962c-11.76224,4.92036 -24.20705,14.27759 -31.87372,22.61092c-7,10.66667 -9.56314,22.69853 -14.51536,36.09557c-3.07167,10.66667 -3.41297,22.01592 -4.77816,33.02389l51.45051,18.54608c13.64391,-10.4437 18.75541,-2.79864 17.38225,-22.45735l150.43345,-4.11945c10.41639,-2.98976 13.90785,-20.93174 -0.21843,-45.14334c-11.53925,-15.81797 -26.49146,-26.1752 -45.88054,-33.46075c-26.77134,-7.27303 -60.3686,-17.27645 -88.16383,-12.94539c-21.17632,1.36518 -26.99431,4.77815 -33.83617,7.84982z"/>',
            '</g>'
        )),
         t,
        "plain"
    );

    H topFro = H(
        string(abi.encodePacked(
            '<g id="hair-top-fro">',
            '<path d="m114.88055,57.88054c-15.18176,0.06069 -19.26003,18.45614 -14.51536,36.09557c-13.07159,5.21217 -9.77656,26.25831 -4.77816,33.02389l44.45051,27.54608c13.64391,-10.4437 25.75541,-11.79864 24.38225,-31.45735l150.43345,-4.11945c10.41639,-2.98976 16.77533,-21.44664 1.90277,-37.56764c7.2978,-9.93978 -10.55573,-34.72793 -22.34869,-31.33448c1.23723,-13.87915 -12.97996,-23.81893 -28.71228,-19.5164c-1.16186,-10.18267 -31.11138,-13.69871 -36.81866,-3.27549c-7.92948,-11.89983 -32.22248,-13.79972 -39.54591,0.05781c-13.01438,-13.14093 -40.27106,-0.52449 -42.37643,12.698c-12.1053,-7.98946 -30.57416,4.62697 -32.07348,17.84946l-0.00001,0z" />',
            '</g>'
        )),
        t,
        "fro"
    );

    H backPlain = H(
        string(abi.encodePacked(
            '<g id="hair-back-plain">',
            '<path d="m100.36519,93.97611c-3.07167,10.66667 -24.34321,37.82988 -25.7084,48.83785c-5.53357,31.89762 -14.48296,39.96007 4.67624,66.29066c7.90444,14.18316 46.79072,30.95702 54.82532,34.71395c8.03461,3.75694 45.9198,-5.70349 48.24234,-13.22704l8.13596,-21.37764l60.69413,0.48283c-2.4043,21.71134 32.36136,24.27834 46.74062,17.22702c14.37926,-7.05132 29.10735,-9.91658 29.18427,-22.37487c0.07692,-12.45829 -21.93918,-61.02125 -15.93203,-89.70048l-210.85845,-20.87228z"/>',
            '</g>'
        )),
        l,
        "plain"
    );

    H backFlip = H(
        string(abi.encodePacked(
            '<g id="hair-back-flip">',
            '<path d="m95.48032,126.79921c1.03185,22.93629 -1.69056,33.92718 2.07167,56.18088c5.94425,17.39705 3.01479,9.87941 6.22867,26.59386c-1.20592,4.41297 -5.4835,13.94539 -17.95222,10.50853c7.90444,14.18316 20.24574,22.22298 38.04778,24.11945c12.34926,3.11149 39.37429,3.15131 50.01706,-3.29352c13.64391,-10.44369 11.92947,-12.35495 10.55631,-32.01366l79.44369,-3.09556l4.10239,14.25938c6.48465,11.9454 17.31741,19.03072 56.31741,4.03072c10.7463,-4.96814 9.54721,-11.30148 12.44368,-22.75426c-12.67463,7.19909 -17.15813,1.42889 -21.98293,-11.50853c-2.22526,-18.65302 -1.03754,-25.70194 3.22184,-43.67236c5.80205,-36.17747 10.6587,-48.31741 -3.46758,-72.52901l-219.04777,53.17408z" />',
            '</g>'
        )),
        l,
        "flip"
    );

    H backShort = H(
        string(abi.encodePacked(
            '<g id="hair-back-short">',
            '<path d="m95.56441,127.15619c-5.53357,31.89762 6.9124,71.12287 -5.55632,67.68601c7.90444,14.18316 24.00001,5.84073 41.80206,7.7372c12.34926,3.11149 4.56199,-50.43231 15.20477,-56.87713l-51.45051,-18.54608z"/>',
            '</g>'
        )),
        l,
        "short"
    );

    H backBraids = H(
        string(abi.encodePacked(
            '<g id="hair-back-braids-top">',
            '<path id="braid-top-right" d="m323.79715,100.96101l-63.96113,4.5484c-13.62177,29.88777 18.44875,81.91014 23.09618,114.9229l18.79303,-2.16346c-2.72448,-38.7821 24.55601,-78.76612 22.07192,-117.30784z" />',
            '<path id="braid-top-left" d="m95.56441,127.15619c-5.53357,31.89762 10.82544,79.38374 9.22629,98.12079l20.93249,0.3459c12.34926,3.11149 10.64895,-73.47579 21.29173,-79.92061l-51.45051,-18.54608z" />',
            '</g>'
        )),
        l,
        "braids"
    );

    H bangsLong = H(
        string(abi.encodePacked(
            '<g id="bangs-long">',
            '<path d="m231.74062,86.34812c6.71217,9.78384 2.16154,15.81343 33.10579,19.11263c31.17179,5.91581 26.5074,7.05347 35.15359,16.72355c9.78385,13.53811 10.35267,17.86121 30.03413,15.35836c-9.55631,-8.19113 -5.11945,-22.18431 -6.14334,-34.81229l-17.74745,-34.12969l-53.92491,-24.57338l-95.90443,3.07167l-50.51195,53.24232l-4.77817,40.61434c-3.2992,16.04095 22.41183,17.40615 30.37544,11.26279c27.7588,-24.57338 57.5654,-26.62115 73.03754,-37.54266c14.33447,-9.67007 26.62116,-23.09442 27.30376,-28.32764z"/>',
            '</g>'
        )),
        b,
        "long"
    );

    H bangsShort = H(
        string(abi.encodePacked(
            '<g id="hair-bangs-short">',
            '<path d="m131.05802,130.03413c0.56883,10.23891 7.6223,0.6826 11.60409,7.16723c2.73038,-13.76564 -3.41296,-6.02957 1.70649,-17.40613c1.0239,5.80205 11.60409,2.04777 9.89761,9.21501c8.19113,-10.12514 1.0239,-13.08305 3.41297,-22.8669c5.11946,6.37088 12.62799,5.57451 15.69966,6.82594c-3.07168,-8.87372 3.41297,-16.04095 5.11946,-13.99318c6.25711,5.57452 6.37087,-0.11376 8.53242,12.628c5.57451,-10.58021 -0.79637,-7.16724 8.53242,-17.74745c-1.25142,8.3049 6.02958,7.05347 11.2628,13.31059c-5.57452,-10.58021 -6.37087,-16.04096 -2.73037,-13.65188c6.48464,2.27531 9.5563,4.89192 10.92149,13.65188c2.50285,-7.16724 3.29921,-9.21502 3.07168,-17.06485c6.37087,6.9397 4.20933,7.05347 4.43686,20.13652c6.37088,-4.20933 4.55062,-10.80774 8.87372,-21.16042c0.22753,7.05347 5.57451,9.32879 5.80204,16.38226c6.25711,-4.55063 0.91013,-14.22071 5.80205,-19.11263c0.11377,10.9215 8.75996,13.65188 8.87372,26.96246c6.93971,-1.47895 -2.84413,-20.36405 7.84984,-22.1843c0.68259,7.73606 5.46075,5.91582 6.14334,13.65188c3.9818,-3.41297 0.79635,-13.65188 4.77815,-17.06485c1.13766,11.03527 7.05347,13.19682 10.9215,18.08874c-3.41297,-9.55632 3.75427,-7.84983 4.09557,-12.62799c3.2992,4.20933 4.55063,1.25142 5.80205,7.16723c-0.56883,5.68828 -5.57452,9.67009 -6.48465,11.9454c5.91582,1.82024 10.46644,-1.13766 11.9454,-5.80205c1.02389,-2.61661 2.73038,-9.32878 2.73038,-12.96928c4.66439,5.57452 -2.27532,22.41182 4.43685,29.35153c-0.22753,-11.94539 5.68829,-11.60409 7.16724,-16.72355c-4.55062,13.87941 4.89192,5.57452 1.02389,25.93857c4.43685,-12.28669 10.23891,-22.8669 9.21502,-35.49488l-15.35837,-27.98635l-53.92491,-24.57338l-95.90443,3.07167l-50.51195,53.24232l-7.84984,27.30376c-3.2992,16.04095 15.2446,22.8669 16.38226,41.63822c8.41866,-23.77702 -0.22754,-16.49601 5.80204,-24.91467c1.82025,6.48464 8.41866,14.33447 8.19113,19.45392c4.09557,-6.37087 2.38908,-26.73492 2.73038,-33.78839z"  />',
            '</g>'
        )),
        b,
        "short"
    );

    H bangsStraight = H(
        string(abi.encodePacked(
            '<g id="hair-bangs-straight">',
            '<path d="m135.44017,140.02895c8.10476,-6.87805 16.20952,-11.24564 24.73268,-15.61324c-0.12256,-6.44202 -4.6173,-19.61773 -8.65769,-25.67834c6.0606,8.50169 9.0909,16.49832 11.61616,23.98991c13.29966,-6.90236 25.08417,-10.77441 36.86868,-14.64647c5.38721,-12.12121 2.69361,-23.73737 -0.50504,-34.84848c3.87205,10.60606 7.7441,19.19192 7.0707,33.33333c17.21257,-4.44895 34.21593,-6.17824 51.0101,-6.4431c3.22471,-7.07071 0.66354,-14.68238 -0.50504,-21.33468c2.18362,5.81548 4.57644,13.93221 4.0404,21.21212c0.50504,0.25253 6.81078,0.2018 10.93782,1.05343c2.84715,-7.82828 2.55625,-6.45158 1.63772,-14.27986c2.57315,6.58749 1.79902,9.82772 1.0249,14.74158c15.974,2.67863 33.88423,8.58589 50.76882,23.22737c2.76024,-11.61509 -0.18197,-20.55796 -1.89792,-27.23958l-31.66326,-38.91708l-52.52525,-19.69697l-54.04041,-1.0101l-60.10101,31.56565l-17.17172,24.49496c0.50505,0.25252 -13.13132,67.42424 -9.09091,63.88888l7.52504,-2.81369l0.52833,-6.11241l4.34366,13.99396c6.65139,-7.98842 13.512,-15.14004 21.20941,-20.82721c-0.60101,-5.89638 -0.99283,-9.2823 -4.3135,-15.8063c3.78048,4.17037 5.4689,8.54993 7.15733,13.76632z"/>',
            '</g>'
        )),
        b,
        "straight"
    );

}