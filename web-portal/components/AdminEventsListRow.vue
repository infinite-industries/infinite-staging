<template>
  <tr>
    <td>
      <img
        v-if="calendarEvent.reviewed_by_org"
        :src="ownerLogo"
        width="30"
      />

    </td>

    <td>{{ calendarEvent.title }}</td>

    <td>
      <div v-for="(date_time, index) in calendarEvent.date_times.slice(0, 2)" :key="index">
        {{ dateFormat(date_time) }}
      </div>

      <small v-if="calendarEvent.date_times.length > 2">
        (and {{ calendarEvent.date_times.length - 2 }} more)
      </small>

      <template
        v-if="calendarEvent.category && calendarEvent.category==='online-resource'"
      >
        Online Resource
      </template>
    </td>

    <td>
      <ii-form-button
        style-type="light"
        @click="onEditClicked(calendarEvent.id)"
        :test-id="'edit-issue-button-' + calendarEvent.id"
      >
        Edit
      </ii-form-button>
    </td>

    <td>
      <input
        type="checkbox"
        :checked="isProblem"
        @change="hasProblemsValueUpdated(calendarEvent, $event)"
      >
    </td>
  </tr>
</template>

<script>
  import FormButton from '~/components/FormButton.vue'
  import momenttz from 'moment-timezone'
  import PartnerService from '~/services/PartnerService'

  export default {
    name: 'AdminEventsListRow',
    components: {
      'ii-form-button': FormButton
    },
    props: ['calendarEvent', 'isProblemUpdated'],
    computed: {
      isProblem: function() {
        // TODO (THIS IS NOT WORKING FOR UN-VERIFIED EVENTS OR RESOURCES BECAUSE THEY ARE FETCHED WITHOUT METADATA)
        if (!this.calendarEvent.event_admin_meta_data) {
          return false
        } else {
          return this.calendarEvent.event_admin_meta_data.is_problem
        }
      },
      ownerLogo: function () {
        return PartnerService.getLogoForReviewer(this.calendarEvent.reviewed_by_org)
      }
    },
    methods: {
      dateFormat: function(date) {
        return [
          momenttz(date.start_time).tz(date.timezone).format('dddd, MMMM Do h:mma'),
          '-',
          momenttz(date.end_time).tz(date.timezone).format('h:mma z')
        ].join(' ')
      },
      onEditClicked(eventId) {
        this.$router.push({ name: 'admin-event-edit-id', params: { id: eventId } })
      },
      hasProblemsValueUpdated: function(data, event) {
        const value = event.currentTarget.checked
        this.$emit('hasProblemsChanged', { id: data.id, checked: value })
      }
    },
    model: {
      event: 'hasProblemsChanged'
    }
  }
</script>
