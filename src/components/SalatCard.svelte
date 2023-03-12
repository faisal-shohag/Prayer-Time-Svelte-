<script>
    import {fade} from "svelte/transition"
    export let s_name;
    export let time;
    export let day;
    export let hijri;
    export let imgUri;
    export let color;
</script>

<div in:fade style="background: {color};" class="s_card">
    
<div class="s_info">
<div class="s_name">{s_name}</div>
<div class="s_time">
    <div class="time">{time}</div>
    <div class="day">{day}</div>
</div>

<div class="s_sub-title">{hijri}  </div>
</div>

<div class="s_right_image"><img alt="" src={imgUri}/></div>
<div class="s_logo">
<img alt="" src="https://cdn-icons-png.flaticon.com/512/9931/9931965.png"/>
</div>
<div class="waves"></div>
</div>

<style>
    .s_card{
        position: relative;
        border-radius: 10px;
        font-family: 'Poppins', Kalpurush;
        padding: 10px;
        margin-top: 5px;
        box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
    }

    .s_card{
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .waves{
        z-index: 1;
        text-align: center;
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        bottom: 0;
        background: #fdfbfb28;
        clip-path: polygon(100% 100%, 0% 100% , 0.00% 63.94%, 2.22% 64.37%, 4.44% 64.27%, 6.67% 63.65%, 8.89% 62.55%, 11.11% 61.05%, 13.33% 59.26%, 15.56% 57.29%, 17.78% 55.29%, 20.00% 53.40%, 22.22% 51.75%, 24.44% 50.45%, 26.67% 49.60%, 28.89% 49.25%, 31.11% 49.43%, 33.33% 50.13%, 35.56% 51.30%, 37.78% 52.85%, 40.00% 54.68%, 42.22% 56.66%, 44.44% 58.65%, 46.67% 60.51%, 48.89% 62.12%, 51.11% 63.35%, 53.33% 64.13%, 55.56% 64.39%, 57.78% 64.13%, 60.00% 63.35%, 62.22% 62.12%, 64.44% 60.51%, 66.67% 58.65%, 68.89% 56.66%, 71.11% 54.68%, 73.33% 52.85%, 75.56% 51.30%, 77.78% 50.13%, 80.00% 49.43%, 82.22% 49.25%, 84.44% 49.60%, 86.67% 50.45%, 88.89% 51.75%, 91.11% 53.40%, 93.33% 55.29%, 95.56% 57.29%, 97.78% 59.26%, 100.00% 61.05%);
    }

    .s_card .s_name{
        font-size: 18px;
        font-weight: bold;
        color: #e7e3e3;
    }

   

    .s_time{
        display: flex;
        gap: 10px;
        align-items: baseline;
        color: #eee;
        line-height: 30px;
        z-index: 2;
    }

    .s_time .time{
        font-size: 40px;
        font-weight: bold;
       
    }

    .s_time .day{
        font-weight: bold;
    }
    .s_sub-title{
        font-size: 10px;
        color: #e7e3e3;
        font-weight: 600;
        z-index: 2;
    }

    .s_logo{
        padding: 10px;
        display: flex;
        justify-content: center;
        align-items: center;
        background: #fff;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        display: none;
        z-index: 2;
    }

    .s_logo img{
        height: 35px;
        
    }

    .s_right_image{
        position: absolute;
        right: 15px;
        bottom: 0px;
        z-index: 2;
    }
    .s_right_image img{
        height: 50px;
    }

  
</style>