<template>
    <div class="modal">
        <div class="title"><h3>Wybrany sposób dostawy</h3></div>
        <div class="selected-supplier">
            <div class="col-1"><img src="../../assets/supp/dpd.png" alt="DPD image" class="img"></div>
            <div class="col-2">
              <h4>Mniszew 25</h4>
              <p>26910 Magnyszew</p>
              <p>PL13883</p>
              <p>Sklep Spożywcy</p>
              <p>515238022</p>
              <p>Parking</p>
              <p>Odbiór</p>
              <p>Nadanie opłaconej przesyłki</p>
              <p>Nadanie na miejscu + płatność i BZT</p>
            </div>
            <div class="col-3">
              <div class="road">
                <p>Wyznacz trasę dojazdu <i class="material-icons">play_arrow</i></p>
              </div>
              <div class="open-hours">
                <p>Godziny otwarcia</p>
                <p>Pon: 06:00-20:00</p><p>Czw: 06:00-20:00</p>
                <p>Wt: 06:00-20:00</p><p>Pt: 06:00-20:00</p>
                <p>Śr: 06:00-20:00</p><p>Sob: 06:00-20:00</p>
              </div>
            </div>
       </div>
       <p><i class="material-icons">arrow_left</i>POWRÓT</p>
       <p>WYBIERZ DPD I ZAMKNIJ</p>
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
}
.modal{
  background: #F5F5F5;
  margin: 30px -80px 0 -80px;
  display: flex;
  flex-direction: column;
}
.title{
  padding-left: 80px;
  h3 {
    margin: 0;
    text-align: left;
    padding-top: 20px;
    font-size: 24px;
    color: #000000;
  }
}
.selected-supplier{
  display: flex;
  justify-content: space-around;
}
.col-2{
  display: flex;
  flex-direction: column;
  align-items: end;
}
</style>
