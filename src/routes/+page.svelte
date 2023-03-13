<script>
import {onMount} from "svelte";
import {fade, fly} from "svelte/transition"
import SalatCard from "../components/SalatCard.svelte";
import {bnSalatNames, Tools} from "../store";
import Fajr from "../images/Fajr.png"
import Dhuhr from "../images/Dhuhr.png"
import Asr from "../images/Asr.png"
import Maghrib from "../images/Maghrib.png"
import Isha from "../images/Isha.png"
import fajr from "../images/fajr.png"
import dhuhr from "../images/dhuhr.png"
import asr from "../images/asr.png"
import maghrib from "../images/maghrib.png"
import isha from "../images/isha.png"
import sahri from "../images/sahri.png"
import iftar from "../images/iftar.png"
import tahajjud from "../images/tahajjud.png"
import SmallCard from "../components/SmallCard.svelte";
import locationPin from "../images/location.png";
let geo;
let days = [];
let today = [];
let salatTimes = [];
let bnSalat =  [];
let tools;
let image = [Fajr, Dhuhr, Asr, Maghrib, Isha];
let PrayerIcon = {
    "Fajr": fajr,
    "Dhuhr": dhuhr,
    "Asr": asr,
    "Maghrib": maghrib,
    "Isha": isha,
    "Sahri": sahri,
    "Iftar": iftar,
    "Tahajjud": tahajjud
}
let color = ["orangered", "#00AB95", "#2D3C6B", "#399349", "#F65E5E"];
let month = new Date().getMonth();
let year = new Date().getFullYear();
let thisDate = new Date().getDate();
let prayers = [];
let location = [];
bnSalatNames.subscribe((data) => {
 bnSalat = data;
});

Tools.subscribe(data=> {
    tools = data;
});

const createPrayerObject = (arr, day) => {
    let obj=[];
    //console.log(arr);
    for(let i=0; i<arr.length-1; i++) {
        if(arr[i][0] !="Isha"){
            obj.push({
            name: arr[i][0],
            start: new Date((month+1) + '-' + (thisDate+day) + '-' + year + ' ' + arr[i][1]),
            time: tools.getTimeFromTime(arr[i][1]).time,
            meridian: tools.getTimeFromTime(arr[i][1]).meridian,
            end: new Date((month+1) + '-' + (thisDate+day) + '-' + year + ' ' + arr[i+1][1]),
            });
        } else if(arr[i][0] == "Midnight") {
            obj.push({
            name: arr[i][0],
            start: new Date((month+1) + '-' + (thisDate+day) + '-' + year + ' ' + arr[i][1]),
            time: tools.getTimeFromTime(arr[i][1]).time,
            meridian: tools.getTimeFromTime(arr[i][1]).meridian,
            end: new Date((month+1) + '-' + (thisDate+day) + '-' + year + ' ' + arr[0][1]),
            });
        }else {
            obj.push({
            name: arr[i][0],
            start: new Date((month+1) + '-' + (thisDate+day) + '-' + year + ' ' + arr[i][1]),
            time: tools.getTimeFromTime(arr[i][1]).time,
            meridian: tools.getTimeFromTime(arr[i][1]).meridian,
            end: new Date((month+1) + '-' + (thisDate+day+1) + '-' + year + ' ' + arr[8][1])
            });
        }
        
    }

    obj.push({
        name: "Sahri",
        start: new Date((month+1) + '-' + (thisDate+day) + '-' + year + ' ' + arr[10][1]),
        time: tools.getTimeFromTime(arr[10][1]).time,
        meridian: tools.getTimeFromTime(arr[10][1]).meridian,
        end: new Date((month+1) + '-' + (thisDate+day) + '-' + year + ' ' + arr[7][1])
    })
    return obj;
}


let triggerAPI = async (todayDate) => {
    const res = await fetch(`https://api.aladhan.com/v1/calendar/2023/3?latitude=${geo.lat}&longitude=${geo.lon}&method=2`)
    days = await res.json();
    days = days.data;
    // console.log((new Date(d)).getDate());
    const td = days.find(d=> parseInt(d.date.gregorian.day) == (new Date(todayDate)).getDate());
    today.push(td);
    let times = Object.entries(td.timings);
    let todayPrayers = times;
    times = times.filter(t=> t[0] != 'Sunset' && t[0] != 'Sunrise' && t[0] != 'Imsak' && t[0] != 'Midnight' && t[0] != 'Firstthird' && t[0] != 'Lastthird')
    salatTimes = times
    let nextDayPrayers = days.find(d=> parseInt(d.date.gregorian.day) == (new Date(month + '-' + (thisDate+1) + '-' + year)).getDate());
        nextDayPrayers = Object.entries(nextDayPrayers.timings);
        todayPrayers = days.find(d=> parseInt(d.date.gregorian.day) == (new Date(month + '-' + (thisDate) + '-' + year)).getDate());
        todayPrayers = Object.entries(todayPrayers.timings);

    todayPrayers = createPrayerObject(todayPrayers, 0);
    nextDayPrayers = createPrayerObject(nextDayPrayers, 1);
    //console.log(todayPrayers);
    //console.log(nextDayPrayers);
     prayers = [];
    //next prayer
    if(new Date() > new Date(todayPrayers[6].start) && new Date() < new Date(todayPrayers[6].end)) {
        prayers.push({...todayPrayers[6], title: "Running Prayer", subtitle: true});
        prayers.push({...nextDayPrayers[0], title: 'Next Prayer', subtitle: true});
        prayers.push({...nextDayPrayers[10], title: 'Sahri', subtitle: false});
        prayers.push({...nextDayPrayers[4], title: 'Iftar', subtitle: false, name: "Iftar"});
    }else {
        let justPrayer = todayPrayers.filter(p=> p.name != 'Sunrise' && p.name != 'Sunset' && p.name != 'Imsak' && p.name != 'Midnight' && p.name != 'Firstthird' && p.name != 'Sahri');
        //console.log(justPrayer);
        let key; 
        let found = false;
        for(let i=0; i<justPrayer.length; i++) {
            if(new Date() >= new Date(justPrayer[i].start) && new Date() <= new Date(justPrayer[i].end)) {
                prayers.push({...justPrayer[i], title: "Running Prayer", subtitle: true});
                key = i;
                found = true;
                break;
            }
         }

         if(!found){
            //no running prayer
            if(new Date() < new Date(justPrayer[1].start)){
               // prayers.push({...todayPrayers[8], title: "Running Prayer", subtitle: true, name: "No Prayer"});
               prayers.push({...justPrayer[1], title: 'Next Prayer', subtitle: true});
            }else{
                prayers.push({...todayPrayers[8], title: "Running Prayer", subtitle: true, name: "Tahajjud"});
                prayers.push({...justPrayer[0], title: 'Next Prayer', subtitle: true});
            }
         }else {
            prayers.push({...justPrayer[key+1], title: 'Next Prayer', subtitle: true});
         }

        

        prayers.push({...todayPrayers[10], title: 'Sahri', subtitle: false});
        prayers.push({...todayPrayers[4], title: 'Iftar', subtitle: false, name: "Iftar"});
    }

    prayers = prayers;
    //console.log(prayers);

   // console.log(prayers);
    

}



let geoReverse = async (lat, lon) => {
    const res = await fetch(`https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&apiKey=b7e39c8621b047638a03d656bd199a75`)
    let data = await res.json();
    data = data.features[0].properties;
    location = [data];
    console.log(location);
}
onMount(async () => {
    // console.log('Mounted!');
    let promise = new Promise ((resolve, reject) => {
        // console.log("Promise Called!");
        if(navigator.geolocation) {
            // console.log("geo Available!")
        navigator.geolocation.watchPosition((position)=> {
            console.log("Geo Enabled!");
        }, (error)=>{
            console.log(error.message);
            console.log("Since Geolocation is not found, default location have been set to lat: '25.7414486', lon: '89.2468397'")
            resolve({lat: "25.7414486", lon: "89.2468397"});
            geoReverse("25.7414486", "89.2468397");
        });
        navigator.geolocation.getCurrentPosition((position, showError) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            console.log(lat, lon);
                geoReverse(lat, lon);
                resolve({lat, lon});
                
        });

    } else {
        reject(new Error("Browser not supported!"));
        console.log("Not supported!");
    }
    })
    
    try{
        geo = await promise;
    } catch(err){
        console.log(err);
    }


    const todayDate = (new Date()).toString();
    triggerAPI(todayDate);

 
});





const totalDaysCount = tools.getTotalDays(month+1, year);
let totalDays = [];
for(let i=thisDate; i<=totalDaysCount; i++) {
    totalDays.push({
        date: i,
        month: month,
        year: year
    });
}

let activeTabValue = thisDate;
const changeDay = (date, month, year) => {
        days = [];
        today = [];
        salatTimes = [];
        triggerAPI(month+"-"+date+"-"+year);
        activeTabValue = date;
}

let x;
</script>
{#each location as loc}
<div class="location_header">
    <div class="loc"><img  alt="" src={locationPin}>{loc.name ? loc.name : loc.city}</div>
    <div class="sub_loc">{loc.street ? loc.street : loc.city}, {loc.state}</div>
</div>
{/each}


<div class="grid">
{#each prayers as prayer}
{#if prayer.subtitle == true}
<SmallCard image={PrayerIcon[prayer.name]} title={prayer.title}>
    <span slot="subtitle">{prayer.name}</span>
    <span slot="timeSlot">{prayer.time}<span class="span">{prayer.meridian}</span></span>
</SmallCard>
{:else}
<SmallCard image={PrayerIcon[prayer.name]} title={prayer.title}><span slot="timeSlot">{prayer.time}<span class="span">{prayer.meridian}</span></SmallCard>
{/if}
{/each}
</div>




<div  class="dateTabs">
{#each totalDays as td, index}
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div  class="{activeTabValue === td.date ? 'active' : ''} alldays" on:click={() => changeDay(td.date, td.month, td.year)}>
    <div class="day">{td.date}</div>
    <div class="monthName">{tools.monthName[td.month]}</div>
    <div class="dayWav"></div>
</div>
{/each}
</div>

{#each salatTimes as sl, index}
    {#each today as t}
    <SalatCard  color={color[index]} imgUri={PrayerIcon[sl[0]]} s_name={bnSalat[sl[0]]} time={tools.func(sl[1])} day={tools.bnDays[t.date.gregorian.weekday.en]} hijri={t.date.hijri.weekday.en + ' • ' +  t.date.hijri.day + ' ' + t.date.hijri.month.en + ' • ' + t.date.hijri.year}/>
    {/each}
    {:else}
    <div class="load">Loading...</div>
{/each}




<style>
/* .wave{
   background: #fafafa2c;
    width: 100%;
    height: 100%;
    position: absolute;
    bottom: 0;
    left: 0;
    clip-path: polygon(100% 100%, 0% 100% , 0.00% 60.08%, 1.00% 60.54%, 2.00% 61.02%, 3.00% 61.50%, 4.00% 61.99%, 5.00% 62.48%, 6.00% 62.96%, 7.00% 63.45%, 8.00% 63.93%, 9.00% 64.41%, 10.00% 64.88%, 11.00% 65.33%, 12.00% 65.77%, 13.00% 66.20%, 14.00% 66.61%, 15.00% 67.00%, 16.00% 67.36%, 17.00% 67.71%, 18.00% 68.03%, 19.00% 68.32%, 20.00% 68.58%, 21.00% 68.82%, 22.00% 69.03%, 23.00% 69.20%, 24.00% 69.34%, 25.00% 69.45%, 26.00% 69.53%, 27.00% 69.57%, 28.00% 69.58%, 29.00% 69.56%, 30.00% 69.50%, 31.00% 69.41%, 32.00% 69.28%, 33.00% 69.13%, 34.00% 68.94%, 35.00% 68.72%, 36.00% 68.47%, 37.00% 68.19%, 38.00% 67.89%, 39.00% 67.56%, 40.00% 67.20%, 41.00% 66.83%, 42.00% 66.43%, 43.00% 66.01%, 44.00% 65.58%, 45.00% 65.13%, 46.00% 64.67%, 47.00% 64.20%, 48.00% 63.72%, 49.00% 63.24%, 50.00% 62.75%, 51.00% 62.26%, 52.00% 61.77%, 53.00% 61.28%, 54.00% 60.81%, 55.00% 60.33%, 56.00% 59.87%, 57.00% 59.43%, 58.00% 58.99%, 59.00% 58.58%, 60.00% 58.18%, 61.00% 57.80%, 62.00% 57.45%, 63.00% 57.12%, 64.00% 56.81%, 65.00% 56.53%, 66.00% 56.28%, 67.00% 56.06%, 68.00% 55.87%, 69.00% 55.72%, 70.00% 55.59%, 71.00% 55.50%, 72.00% 55.44%, 73.00% 55.42%, 74.00% 55.43%, 75.00% 55.47%, 76.00% 55.55%, 77.00% 55.66%, 78.00% 55.80%, 79.00% 55.97%, 80.00% 56.18%, 81.00% 56.41%, 82.00% 56.68%, 83.00% 56.97%, 84.00% 57.29%, 85.00% 57.63%, 86.00% 58.00%, 87.00% 58.39%, 88.00% 58.80%, 89.00% 59.22%, 90.00% 59.66%, 91.00% 60.12%, 92.00% 60.59%, 93.00% 61.06%, 94.00% 61.54%, 95.00% 62.03%, 96.00% 62.52%, 97.00% 63.01%, 98.00% 63.50%, 99.00% 63.98%, 100.00% 64.45%);
    } */
     .location_header{
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        margin-bottom: 10px;
        box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
        padding: 5px;
        border-radius: 20px;
        padding-right: 10px;
     }

     .loc img {
        height: 20px;
     }
    .loc{
        display: flex;
        align-items: center;
    }

    .sub_loc{
        font-size: 10px;
    }

    .grid{
        display: grid;
        column-gap: 20px;
        grid-column-start: 1;
        grid-column-end: 2;
        grid-template-columns: auto auto;
        row-gap: 20px;
    }

    .dateTabs{
        display: flex;
        overflow-y: hidden;
        font-family: Poppins;
        gap: 5px;
        color: #eee;
        overflow-x: scroll;
        padding-bottom: 2px;
        margin-top: 10px;
    }

    .alldays{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 40px;
        width: 40px;
        border-radius: 50%;
        background: #fff;
        color: #222;
        flex-basis: 40px;
        flex-shrink: 0;
        flex-grow: 0;
        border: 1px solid #ebe8e8;
        position: relative;
        overflow: hidden;
    }

    .alldays .monthName{
        font-size: 10px;
        line-height: 7px;
        margin-bottom: 5px;
        
    }

    .alldays .day{
        font-weight: bold;
    }

    .active{
    background: #5ea54c;
    color: #ebe8e8;
    
    }

    .dayWav{
        position: absolute;
        background: rgba(255, 254, 254, 0.103);
        height: 100%;
        width: 100%;
        clip-path: polygon(100% 100%, 0% 100% , 0.00% 60.08%, 1.00% 60.54%, 2.00% 61.02%, 3.00% 61.50%, 4.00% 61.99%, 5.00% 62.48%, 6.00% 62.96%, 7.00% 63.45%, 8.00% 63.93%, 9.00% 64.41%, 10.00% 64.88%, 11.00% 65.33%, 12.00% 65.77%, 13.00% 66.20%, 14.00% 66.61%, 15.00% 67.00%, 16.00% 67.36%, 17.00% 67.71%, 18.00% 68.03%, 19.00% 68.32%, 20.00% 68.58%, 21.00% 68.82%, 22.00% 69.03%, 23.00% 69.20%, 24.00% 69.34%, 25.00% 69.45%, 26.00% 69.53%, 27.00% 69.57%, 28.00% 69.58%, 29.00% 69.56%, 30.00% 69.50%, 31.00% 69.41%, 32.00% 69.28%, 33.00% 69.13%, 34.00% 68.94%, 35.00% 68.72%, 36.00% 68.47%, 37.00% 68.19%, 38.00% 67.89%, 39.00% 67.56%, 40.00% 67.20%, 41.00% 66.83%, 42.00% 66.43%, 43.00% 66.01%, 44.00% 65.58%, 45.00% 65.13%, 46.00% 64.67%, 47.00% 64.20%, 48.00% 63.72%, 49.00% 63.24%, 50.00% 62.75%, 51.00% 62.26%, 52.00% 61.77%, 53.00% 61.28%, 54.00% 60.81%, 55.00% 60.33%, 56.00% 59.87%, 57.00% 59.43%, 58.00% 58.99%, 59.00% 58.58%, 60.00% 58.18%, 61.00% 57.80%, 62.00% 57.45%, 63.00% 57.12%, 64.00% 56.81%, 65.00% 56.53%, 66.00% 56.28%, 67.00% 56.06%, 68.00% 55.87%, 69.00% 55.72%, 70.00% 55.59%, 71.00% 55.50%, 72.00% 55.44%, 73.00% 55.42%, 74.00% 55.43%, 75.00% 55.47%, 76.00% 55.55%, 77.00% 55.66%, 78.00% 55.80%, 79.00% 55.97%, 80.00% 56.18%, 81.00% 56.41%, 82.00% 56.68%, 83.00% 56.97%, 84.00% 57.29%, 85.00% 57.63%, 86.00% 58.00%, 87.00% 58.39%, 88.00% 58.80%, 89.00% 59.22%, 90.00% 59.66%, 91.00% 60.12%, 92.00% 60.59%, 93.00% 61.06%, 94.00% 61.54%, 95.00% 62.03%, 96.00% 62.52%, 97.00% 63.01%, 98.00% 63.50%, 99.00% 63.98%, 100.00% 64.45%);
    }
    .span{
        font-size: 10px;
    }
</style>

