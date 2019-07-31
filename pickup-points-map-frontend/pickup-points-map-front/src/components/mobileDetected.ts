export const MobileDetected = {
  name: 'MobileDetected',
  components: {
  },
  data () {
    return {
      window: {
        width: 0,
        height: 0
      },
      isMobile: false
    }
  },
  created () {
    window.addEventListener('resize', this.handleResize)
    this.handleResize()
  },
  destroyed () {
    window.removeEventListener('resize', this.handleResize)
  },
  methods: {
    handleResize () {
      this.window.width = window.innerWidth
      this.window.height = window.innerHeight
      if (this.window.width <= 767) {
        this.isMobile = true
      } else {
        this.isMobile = false
      }
    },
    openFooterModal () {
      this.$store.commit('openFooterModal')
    },
    closeFooterModal () {
      this.$store.commit('closeFooterModal')
    }
  },
  computed: {
    isWidgetVersion () {
      return this.$store.state.customer.theme
    },
    IsFooterModalOpen () {
      return this.$store.state.isFooterModalOpen
    }
  }
}

