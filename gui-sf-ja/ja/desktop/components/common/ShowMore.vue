<template>
  <GogoLink class="btn-loadmore no-underlying" :target="target">
    {{ label }}
    <span class="flex mid center ml-5"><ArrowRight/></span>
  </GogoLink>
</template>
<script>
import ArrowRight from '@@/../components/icons/ArrowRight.vue'
import GogoLink from '@@/../components/link/GogoLink.vue'
import i18n from '@@/lang/components-desktop/common-showmore.json'
export default {
  components: {
    ArrowRight,
    GogoLink,
  },
  props: {
    text: {
      type: String,
    },
    target: {
      type: [String, Object],
      default: '/',
    },
  },
  i18n: {
    messages: i18n,
  },
  data() {
    return {
      label: this.text || this.$t('1'),
    }
  },
}
</script>
<style lang="scss" scoped>
.btn-loadmore {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  /deep/ a {
    display: flex;
    color: #424a54;
    &:hover {
      text-decoration: underline;
    }
  }
  span {
    width: 16px;
    height: 16px;
    background: #434a54;
    border-radius: 50%;
    display: inline-block;
    i.icon-cls {
      width: 16px;
      height: 16px;
      color: white;
      margin-left: 1px;
    }
  }
  &.bg-dot {
    justify-content: center;
    height: 40px;
    font-size: 16px;
    background-repeat: repeat;
    background-image: url(data:image/jpeg;base64,/9j/4QAYRXhpZgAASUkqAAgAAAAAAAAAAAAAAP/sABFEdWNreQABAAQAAABkAAD/4QMvaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjYtYzEzOCA3OS4xNTk4MjQsIDIwMTYvMDkvMTQtMDE6MDk6MDEgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE3IE1hY2ludG9zaCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDozNEQ5OEE2RjhFNTAxMUU4QkZFNEE2RkUxNjUwQTZFNSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDozNEQ5OEE3MDhFNTAxMUU4QkZFNEE2RkUxNjUwQTZFNSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjM0RDk4QTZEOEU1MDExRThCRkU0QTZGRTE2NTBBNkU1IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjM0RDk4QTZFOEU1MDExRThCRkU0QTZGRTE2NTBBNkU1Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+/+4ADkFkb2JlAGTAAAAAAf/bAIQAAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQICAgICAgICAgICAwMDAwMDAwMDAwEBAQEBAQECAQECAgIBAgIDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMD/8AAEQgABAAEAwERAAIRAQMRAf/EAaIAAAAGAgMBAAAAAAAAAAAAAAcIBgUECQMKAgEACwEAAAYDAQEBAAAAAAAAAAAABgUEAwcCCAEJAAoLEAACAQMEAQMDAgMDAwIGCXUBAgMEEQUSBiEHEyIACDEUQTIjFQlRQhZhJDMXUnGBGGKRJUOhsfAmNHIKGcHRNSfhUzaC8ZKiRFRzRUY3R2MoVVZXGrLC0uLyZIN0k4Rlo7PD0+MpOGbzdSo5OkhJSlhZWmdoaWp2d3h5eoWGh4iJipSVlpeYmZqkpaanqKmqtLW2t7i5usTFxsfIycrU1dbX2Nna5OXm5+jp6vT19vf4+foRAAIBAwIEBAMFBAQEBgYFbQECAxEEIRIFMQYAIhNBUQcyYRRxCEKBI5EVUqFiFjMJsSTB0UNy8BfhgjQlklMYY0TxorImNRlUNkVkJwpzg5NGdMLS4vJVZXVWN4SFo7PD0+PzKRqUpLTE1OT0laW1xdXl9ShHV2Y4doaWprbG1ub2Z3eHl6e3x9fn90hYaHiImKi4yNjo+DlJWWl5iZmpucnZ6fkqOkpaanqKmqq6ytrq+v/aAAwDAQACEQMRAD8A30/8u+x/6sv/AJMX94v7u/3d/wDP1/eX+Nf9P/B/00+/de6//9k=);
    span {
      width: 18px;
      height: 18px;
      margin-top: 1px;
      i {
        margin-top: 1px;
      }
    }
  }
}
</style>
