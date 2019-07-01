<template>
    <div class="modal">
        <div class="title">
          <h3>Wybrany punkt</h3>
        </div>
        <div class="selected-supplier">
          <div class="col1">
              <div class="address">
                <h4>Mniszew 25</h4>
                <p>26910 Magnuszew,</p>
                <p>PL13883</p>
              </div>
              <div class="shop paddbot">
                <p>Sklep Spożywcy</p>
                <p>515238022</p>
              </div>
              <div class="shop">
                <p>Parking</p>
                <p>Odbiór</p>
                <p>Nadanie opłaconej przesyłki</p>
                <p>Nadanie na miejscu + płatność i BZT</p>
              </div>
          </div>
          <div class="col2">
            <p class="hours-title">Godz. otwarcia:</p>
            <p>Pon: 06:00-20:00</p>
            <p>Wt: 06:00-20:00</p>
            <p>Śr: 06:00-20:00</p>
            <p>Czw: 06:00-20:00</p>
            <p>Pt: 06:00-20:00</p>
            <p>Sob: 06:00-20:00</p>
          </div>
          <div class="col3">
             <div class="logo">
               <img src="../../assets/logos/dpd.png" alt="DPD image" class="img">
             </div>
             <div class="road">
                <p>Wyznacz trasę dojazdu</p>
             </div>
          </div>
        </div>
        <div class="footer">
          <span class="powrot"><i class="material-icons -">arrow_left</i>POWRÓT</span>
          <p>WYBIERZ DPD I ZAMKNIJ</p>
        </div>
    </div>
</template>

<script>
export default {
  name: 'ModalDiv',
  data () {
    return {

    }
  }
}
</script>

<style lang="scss" scoped>
p {
  padding: 0;
  margin: 0;
}
.img{
    width: 85px;
}
.modal{
  display: flex;
  flex-direction: column;
  margin: 20px;
  border: 1px solid #E54C69;
  background-color: white;
}
.title{
    padding-left: 40px;
    h3{
        text-align: left;
        font-size: 22px;
        margin: 15px 0;
    }
}
.selected-supplier{
   display: flex;
   justify-content: space-between;
   padding-bottom: 15px;
   border-bottom: 1px solid #E5E5E5;
   margin: 0 40px
}
.col1{
   display: flex;
   flex-direction: column;
}
.col2{
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: end;
    color: #000000;
    .hours-title{
        font-size: 16px;
        font-weight: 700;
    }
    p{
        font-size: 15px;
    }
}
.col3{
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    color: #000000;
    font-size: 15px;
}
.address{
    display: flex;
    flex-direction: column;
    align-items: end;
    color:#000000;
    font-size: 15px;
    padding-bottom: 15px;
    h4{
        margin: 0;
        font-size: 16px;
    }
}
.shop{
    display: flex;
    flex-direction: column;
    align-items: end;
    font-size: 14px;
    color: #000000;
}
.paddbot{
    padding-bottom: 15px;
}
.footer{
    display: flex;
    justify-content: space-between;
    margin: 20px 40px 20px 40px;
    p {
        background-color: #E4405F;
        border-radius: 3px;
        font-size: 14px;
        font-weight: 700;
        color: #FFFFFF;
        padding: 10px 25px;
        cursor: pointer;
    }
}
.powrot{
  display: flex;
  height: fit-content;
  font-size: 16px;
  color: #ADADAD;
  align-items: center;
  i {
    font-size: 35px;
  }
}
</style>
