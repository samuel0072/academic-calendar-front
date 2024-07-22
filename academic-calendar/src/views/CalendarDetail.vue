<template>
  <div>
    <nav>
        <span>ir para</span>
        <div class="btn-group" role="group">
            
            <BaseButton type="button" @click.native="onClickMoveButton(-1)">
            <- mês anterior
            </BaseButton>
            <BaseButton type="button" @click.native="onClickTodayButton"> hoje </BaseButton>
            <BaseButton type="button" @click.native="onClickMoveButton(1)">
            próximo mês ->
            </BaseButton>
        </div>
    </nav>
    <BaseButton data-bs-toggle="modal" data-bs-target="#createEvents" type="button">
                    Crie um evento
    </BaseButton>
    

    <h1 class="date-range">{{ dateRangeText }}</h1>

    <ToastUICalendar
      ref="calendar"
      style="height: 800px; width: 1200px"
      :view="'month'"
      :use-form-popup="false"
      :use-detail-popup="false"
      :week="{
        showTimezoneCollapseButton: true,
        timezonesCollapsed: false,
        eventView: true,
        taskView: true,
      }"
      :month="{ startDayOfWeek: 7 }"
      :timezone="{ zones }"
      :theme="theme"
      :template="{
        milestone: getTemplateForMilestone,
        allday: getTemplateForAllday,
      }"
      :grid-selection="true"
      :calendars="calendars"
      :events="events"
      @selectDateTime="onSelectDateTime"
      @beforeCreateEvent="onBeforeCreateEvent"
      @beforeUpdateEvent="onBeforeUpdateEvent"
      @beforeDeleteEvent="onBeforeDeleteEvent"
      @afterRenderEvent="onAfterRenderEvent"
      @clickDayName="onClickDayName"
      @clickEvent="onClickEvent"
      @clickTimezonesCollapseBtn="onClickTimezonesCollapseBtn"
    />

    <BaseModal modal_id="createEvents">
        <template v-slot:modal-title>
            <h5>Crie um evento</h5>
        </template>

        <template v-slot:modal-body>
            <BaseForm @submit="" id="event-creation-form">
                <FloatingInput 
                  id="event_name"
                  v-model="newEvent.description"
                  label="Digite o nome do evento"
                  type="text"
                  maxlength="500"
                />

                <BaseLabel for="event-label"> Escolha o tipo do evento: </BaseLabel>
                <BaseSelectInput 
                  id="event-label" 
                  :options="eventLabels" 
                  v-model="newEvent.label"
                />
                <ColorPicker v-model="newEvent.bgColor"/>
            </BaseForm>
        </template>

        <template v-slot:modal-footer>
            <div>
                <BaseButton type="submit" form="event-creation-form"  class="btn btn-primary">
                    Criar
                </BaseButton>
            </div>
        </template>
    </BaseModal>


  </div>
</template>

<script>
/* eslint-disable no-console */
import ToastUICalendar from "@/components/ToastUICalendar.vue"
import "@toast-ui/calendar/toastui-calendar.css"

import { theme } from "@/views/assets/theme.js"

import axios from "axios"
import * as bootstrap from 'bootstrap'

import { mapStores } from "pinia"
import { useUserAuthInfoStore } from "@/stores/userAuthInfo"

import BaseButton from "@/components/BaseButton.vue"
import BaseModal from '@/components/BaseModal.vue'
import BaseForm from '@/components/BaseForm.vue'
import FloatingInput from '@/components/FloatingInput.vue'
import BaseSelectInput from '@/components/BaseSelectInput.vue'
import BaseLabel from '@/components/BaseLabel.vue'
import ColorPicker from '@/components/ColorPicker.vue'


export default {
  data() {
    return {
      calendars: [
        {
          id: "0",
          name: "Private",
          backgroundColor: "#9e5fff",
          borderColor: "#9e5fff",
          dragBackgroundColor: "#9e5fff",
        },
      ],
      events: [],
      zones: [
        {
          timezoneName: "Asia/Seoul",
          displayLabel: "Seoul",
          tooltip: "UTC+09:00",
        },
        {
          timezoneName: "Pacific/Guam",
          displayLabel: "Guam",
          tooltip: "UTC+10:00",
        },
      ],
      theme,
      selectedView: "month",
      viewOptions: [
        {
          title: "Monthly",
          value: "month",
        },
        {
          title: "Weekly",
          value: "week",
        },
        {
          title: "Daily",
          value: "day",
        },
      ],
      dateRangeText: "",
      newEvent: {
        description: "",
        startDate: "",
        endDate: "",
        label: "",
        bgColor: "",
        campi: []
      },
      eventLabels: [
        {value: 'H', label: 'Feriado Nacional'},
        {value: 'RH', label: 'Feriado Local'},
        {value: 'NSS', label: 'Sábado não-letivo'},
        {value: 'NSD', label: 'Dia(s) não-letivo(s)'},
        {value: 'SD', label: 'Dia(s) letivo(s)'},
      ]
    };
  },
  computed: {
    calendarInstance() {
      return this.$refs.calendar.getInstance();
    },
    ...mapStores(useUserAuthInfoStore),
  },
  watch: {
    selectedView(newView) {
      this.calendarInstance.changeView(newView);
      this.setDateRangeText();
    },
  },
  mounted() {
    this.setDateRangeText();
    this.getEvents();
  },
  methods: {
    getEvents() {
      axios
        .get(`/api/academic-calendar/calendar/${this.$route.params.id}/events`, {
          headers: {
            Authorization: "Bearer " + this.userAuthInfoStore.token,
          },
        })
        .then((res) => {
          //console.log(res);
          res.data.forEach((event) => {
            if (event.end_date === null) {
              event.end_date = event.start_date;
            }

            this.events.push({
              id: event.id,
              calendarId: "0",
              title: event.description,
              category: "allday",
              start: event.start_date,
              end: event.end_date,
              label: event.label,
              backgroundColor: `#${event.hexadecimal_color}`,
              campi: event.campi,
              organization: event.organization,
              isAllday: true,
            });
          });
        });
    },
    getTemplateForMilestone(event) {
      return `<span style="color: #fff; background-color: ${event.backgroundColor};">${event.title}</span>`;
    },
    getTemplateForAllday(event) {
      return `[All day] ${event.title}`;
    },
    onSelectDateTime({ start, end }) {
      this.calendarInstance.clearGridSelections();
      console.group("onSelectDateTime");
      console.log(`Date : ${start} ~ ${end}`);
      console.groupEnd();
    },
    onBeforeCreateEvent(eventData) {
      const event = {
        calendarId: eventData.calendarId || "",
        id: String(Math.random()),
        title: eventData.title,
        isAllday: eventData.isAllday,
        start: eventData.start,
        end: eventData.end,
        category: eventData.isAllday ? "allday" : "time",
        dueDateClass: "",
        location: eventData.location,
        state: eventData.state,
        isPrivate: eventData.isPrivate,
      };

      this.calendarInstance.createEvents([event]);
    },
    onBeforeUpdateEvent(updateData) {
      console.group("onBeforeUpdateEvent");
      console.log(updateData);
      console.groupEnd();

      const targetEvent = updateData.event;
      const changes = { ...updateData.changes };

      this.calendarInstance.updateEvent(targetEvent.id, targetEvent.calendarId, changes);
    },

    onBeforeDeleteEvent({ title, id, calendarId }) {
      console.group("onBeforeDeleteEvent");
      console.log("Event Info : ", title);
      console.groupEnd();

      this.calendarInstance.deleteEvent(id, calendarId);
    },
    onAfterRenderEvent({ title }) {
      console.group("onAfterRenderEvent");
      console.log("Event Info : ", title);
      console.groupEnd();
    },
    onClickDayName({ date }) {
      console.group("onClickDayName");
      console.log("Date : ", date);
      console.groupEnd();
    },
    onClickEvent({ nativeEvent, event }) {
      console.group("onClickEvent");
      console.log("MouseEvent : ", nativeEvent);
      console.log("Event Info : ", event);
      console.groupEnd();
    },

    onClickTimezonesCollapseBtn(timezoneCollapsed) {
      console.group("onClickTimezonesCollapseBtn");
      console.log("Is Timezone Collapsed?: ", timezoneCollapsed);
      console.groupEnd();

      const newTheme = {
        "week.daygridLeft.width": "100px",
        "week.timegridLeft.width": "100px",
      };

      this.calendarInstance.setTheme(newTheme);
    },
    onClickTodayButton() {
      this.calendarInstance.today();
      this.setDateRangeText();
    },
    onClickMoveButton(offset) {
      this.calendarInstance.move(offset);
      this.setDateRangeText();
    },
    setDateRangeText() {
      const date = this.calendarInstance.getDate();
      const start = this.calendarInstance.getDateRangeStart();
      const end = this.calendarInstance.getDateRangeEnd();

      const startYear = start.getFullYear();
      const endYear = end.getFullYear();

      switch (this.selectedView) {
        case "month":
          this.dateRangeText = `${date.getFullYear()}.${date.getMonth() + 1}`;

          return;
        case "day":
          this.dateRangeText = `${date.getFullYear()}.${
            date.getMonth() + 1
          }.${date.getDate()}`;

          return;
        default:
          this.dateRangeText = `${startYear}.${
            start.getMonth() + 1
          }.${start.getDate()} - ${startYear !== endYear ? `${endYear}.` : ""}${
            end.getMonth() + 1
          }.${end.getDate()}`;
      }
    },
  },
  components: {
    ToastUICalendar: ToastUICalendar,
    BaseButton: BaseButton,
    BaseModal: BaseModal,
    BaseForm: BaseForm,
    FloatingInput: FloatingInput,
    BaseSelectInput: BaseSelectInput,
    BaseLabel: BaseLabel,
    ColorPicker: ColorPicker
  },
};
</script>
