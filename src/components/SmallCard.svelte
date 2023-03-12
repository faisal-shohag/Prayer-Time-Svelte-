<script>
    export let image;
    export let title;
</script>
<div class="sm_card">
    <div class="card_title">{title}</div>
    <div class="card_sub-title">
        <slot name="subtitle"></slot>
    </div>
    <div class="card_time">
        <slot name="timeSlot"></slot>
    </div>
    <div class="candt">
        <div class="countdown"><slot name="countdown"></slot></div>
        <div class="icon"><img alt="" src={image}/></div>
    </div>
</div>

<style>

    .sm_card{
        display: flex;
        flex-direction: column;
        padding: 10px;
        border-radius: 20px;
        background: rgba(227, 223, 230, 0.281);
        box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
        min-width: 150px;
    }
    .sm_card .icon img{
        height: 50px;
    }

    .card_title{
        font-size: 18px;
        font-weight: bold;
        color: rgb(47, 48, 116);
    }

    .card_time{
        font-weight: 600;
        font-size: 18px;
        color: #5742C0;
    }


 
    .candt{
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
    }

    .card_sub-title{
        color: orangered;
    }

    
     
</style>