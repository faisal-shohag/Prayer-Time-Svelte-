import {  writable } from "svelte/store";

const bnSalatNames = writable ({
    "Asr":"আসর",
    "Dhuhr":"যুহর",
    "Fajr":"ফজর",
    "Firstthird": "রাত্রির প্রথমভাগ",
    "Imsak":"ইমসাক",
    "Isha":"এশা",
    "Lastthird": "রাত্রির শেষভাগ",
    "Maghrib":"মাগরিব",
    "Midnight": "মধ্যরজনী",
    "Sunrise":"সূর্যোদয়",
    "Sunset":"সূর্যাস্ত",
});


let bnNumber = {
    0: "০",
    1: "১",
    2: "২",
    3: "৩",
    4: "৪",
    5: "৫",
    6: "৬",
    7: "৭",
    8: "৮",
    9: "৯",
  }
 let days = {
    "Friday":"শুক্র",
    "Saturday":"শনি",
    "Sunday":"রবি",
    "Monday":"সোম",
    "Tuesday":"মঙ্গল",
    "Wednesday":"বুধ",
    "Thursday":"বৃহ:",
}
const Tools = writable ({
    func: function(time) {
        time = time.split(" ")[0];
        time = time.split(":");
        let a = parseInt(time[0]);
        let b = parseInt(time[1]);
        if(a>12) a -= 12;
        if(a<10) {
            a = "০" + bnNumber[a] 
        }else {
            a = bnNumber[parseInt(a/10)] + '' + bnNumber[a%10];
        }
        if(b<10){ 
            b = "০" + bnNumber[b]} 
        else {
            b = bnNumber[parseInt(b/10)] + '' + bnNumber[b%10];
        }
        return a+":"+b;
    },
    bnNumber: bnNumber,
    bnDays: days,
    getTotalDays: function(month, year) {
        return new Date(year, month, 0).getDate();
    },
    monthName: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    getTimeFromDate: function(date){
        let a = date.split(' ')[4];
        let hr = parseInt(a.split(':')[0]);
        let min = (a.split(':')[1]);
        if(hr>=12){
            hr -= 12;
        }
        return hr+':'+min;
    },
    getAMPM: function(date){
        let a = date.split(' ')[4];
        let hr = parseInt(a.split(':')[0]);
        let m = "am";
        if(hr>=12){
            m = "pm";
            hr -= 12;
        }
        return m;
    },
    getTimeFromTime: function(time) {
        time = time.split(" ")[0];
        let hr = parseInt(time.split(":")[0]);
        let min = time.split(":")[1];
        let m = "am";
        if(hr>=12){
            hr -= 12;
            m = "pm";
        }

        return {
            time: hr+':'+min,
            meridian: m
        }
    }
});

export {
 bnSalatNames, 
 Tools
};