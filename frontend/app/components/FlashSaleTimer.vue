<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps<{
  endsAt: string | Date
}>()

const emit = defineEmits(['expired'])

const timeLeft = ref({
  hours: 0,
  minutes: 0,
  seconds: 0
})

const isExpired = ref(false)
let timer: any = null

const calculateTimeLeft = () => {
  const end = new Date(props.endsAt).getTime()
  const now = new Date().getTime()
  const diff = end - now

  if (diff <= 0) {
    isExpired.value = true
    timeLeft.value = { hours: 0, minutes: 0, seconds: 0 }
    emit('expired')
    if (timer) clearInterval(timer)
    return
  }

  timeLeft.value = {
    hours: Math.floor((diff / (1000 * 60 * 60))),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diff % (1000 * 60)) / 1000)
  }
}

const pad = (n: number) => n.toString().padStart(2, '0')

onMounted(() => {
  calculateTimeLeft()
  timer = setInterval(calculateTimeLeft, 1000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<template>
  <div v-if="!isExpired" class="flash-sale-timer flex items-center gap-1">
    <div class="time-unit">{{ pad(timeLeft.hours) }}</div>
    <span class="separator">:</span>
    <div class="time-unit">{{ pad(timeLeft.minutes) }}</div>
    <span class="separator">:</span>
    <div class="time-unit">{{ pad(timeLeft.seconds) }}</div>
  </div>
</template>

<style scoped>
.flash-sale-timer {
  font-family: monospace;
  font-weight: 800;
  color: white;
}

.time-unit {
  background: #dc2626;
  padding: 2px 4px;
  border-radius: 4px;
  min-width: 24px;
  text-align: center;
  font-size: 0.85rem;
}

.separator {
  color: #dc2626;
  font-weight: 900;
}
</style>
