<template>
  <canvas id="TtGj4" :width="width" :height="height">
    Your browser does not support the HTML5 canvas tag.
  </canvas>
</template>

<script>
export default {
  props: {
    width: {
      type: Number,
      default: 140,
    },
    height: {
      type: Number,
      default: 70,
    },
    value: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      innerValue: null,
    }
  },
  methods: {
    randomValue() {
      console.log(this.cId)
      let c = document.getElementById('TtGj4'),
        ctx = c.getContext('2d'),
        text = (Math.floor(Math.random() * 99999) + 10000).toString()
      this.innerValue = text
      this.drawTextBG(ctx, text, '25px arial')
    },
    validate(callback) {
      callback(this.innerValue === this.value)
    },
    drawTextBG(ctx, txt, font) {
      ctx.save()
      ctx.font = font
      ctx.textBaseline = 'middle'
      ctx.textAlign = 'center'
      ctx.fillStyle = '#586672'
      ctx.fillRect(0, 0, this.width, this.height)
      ctx.fillStyle = 'white'
      ctx.fillText(txt, this.width / 2, this.height / 2)
      ctx.restore()
    },
  },
  mounted() {
    this.randomValue()
  },
}
</script>
