<template>
    <div class="modal">
       <div class="content">
          <div class="title"><h3>Wybrany sposób dostawy</h3></div>
          <div class="selected-supplier">
            <div class="col-1">
              <div class="address">
                <h4>Mniszew 25</h4>
                <p>26910 Magnyszew</p>
                <p>PL13883</p>
              </div>
              <div class="shop paddbott">
                <p>Sklep Spożywcy</p>
                <p>515238022</p>
              </div>
              <div class="shop additional">
                <p>Parking</p>
                <p>Odbiór</p>
                <p>Nadanie opłaconej przesyłki</p>
                <p>Nadanie na miejscu + płatność i BZT</p>
              </div>
            </div>
            <div class="col-2">
              <div class="logo">
                <img src="../../assets/logos/dpd.png" alt="DPD image" class="img">
                <div class="road">
                  <p>Wyznacz trasę dojazdu <i class="material-icons">play_arrow</i></p>
                </div>
              </div>
              <div class="open-hours">
                <div class="hours-title">
                  <p>Godziny otwarcia</p>
                </div>
                <div class="week">
                  <div class="first-half">
                    <p>Pon: 06:00-20:00</p>
                    <p>Wt: 06:00-20:00</p>
                    <p>Śr: 06:00-20:00</p>
                  </div>
                  <div class="second-half">
                    <p>Czw: 06:00-20:00</p>
                    <p>Pt: 06:00-20:00</p>
                    <p>Sob: 06:00-20:00</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
       </div>
       <div class="footer">
         <p class="powrot"><i class="material-icons -">arrow_left</i>POWRÓT</p>
         <p class="zamknij">WYBIERZ DPD I ZAMKNIJ</p>
       </div>
    </div>
</template>

<script>
export default {
  name: 'ModalDivV2',
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
  padding-right: 55px;
}
.content{
  background: #F5F5F5;
  padding-bottom: 15px;
}
.modal{
  width: 100%;
  margin: 25px -35px 0px 0px;
  display: flex;
  flex-direction: column;
  border-radius: 9px;
}
.footer{
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
}
.title{
  padding-left: 40px;
  h3 {
    margin: 0;
    text-align: left;
    padding-top: 20px;
    font-size: 22px;
    color: #000000;
  }
}
.selected-supplier{
  display: flex;
  justify-content: space-around
}
.col-1{
  display: flex;
  flex-direction: column;
  align-items: end;
  flex: 0 0 40%;
}
.col-2{
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  justify-content: space-between;
  flex: 0 0 40%;
}
.logo{
  display: flex;
}
.road{
  display: flex;
  justify-content: center;
  p {
    display: flex;
    font-size: 14px;
    color: #000000;
    align-items: center;
  }
}
.open-hours{
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
}
.hours-title{
  width: 100%;
  display: flex;
  p {
    font-size: 16px;
    color: #000000;
    font-weight: 600;
    padding: 10px 0;
  }
}
.week{
  display: flex;
  color: #000000;
}
.first-half {
  padding-right: 20px;
  text-align: left;
}
.second-half{
  text-align:left;
}
.address{
  display: flex;
  flex-direction: column;
  align-items: end;
  padding: 15px 0;
  color: #000000;
  font-size: 16px;
  h4{
    margin: 0;
    font-weight: 900;
  }
}
.shop {
  display: flex;
  flex-direction: column;
  align-items: end;
  font-size: 14px;
  color: #000000;
}
.additional{
  opacity: 0.8;
}
.paddbott{
  padding-bottom: 15px;
}
.powrot{
  display: flex;
  height: fit-content;
  font-size: 20px;
  color: #ADADAD;
  align-items: center;
  i {
    font-size: 50px;
  }
}
.zamknij{
  background: #E4405F;
  height: 45px;
  display: flex;
  align-items: center;
  border-radius: 9px;
  justify-content: center;
  font-size: 18px;
  color: #FFFFFF;
  padding: 0 20px;
  z-index: 999;
  cursor: pointer;
  margin-right: 10px;
}
</style>
