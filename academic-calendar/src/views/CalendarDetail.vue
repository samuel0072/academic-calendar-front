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
				<BaseForm @submit="createEvent" id="event-creation-form" type="feedback" ref="eCForm" novalidate>
					<FloatingInput 
						ref="eCDescription"
						id="event-description"
						v-model="newEvent.description"
						label="Digite o nome do evento"
						type="text"
						maxlength="500"
					>
						<FormInputFeedback type="invalid">
							{{ eCFormInputFeedbacks.description }}
						</FormInputFeedback>
					</FloatingInput>
					

					<BaseLabel for="event-label"> Escolha o tipo do evento: </BaseLabel>
					<BaseSelectInput 
						ref="ecLabel"
						id="event-label" 
						:options="eventLabels" 
						v-model="newEvent.label"
					/>
					<FormInputFeedback type="invalid">
						{{ eCFormInputFeedbacks.label }}
					</FormInputFeedback>

					<BaseLabel for="event-bg-color"> Escolha a cor de fundo: </BaseLabel>
					<ColorPicker v-model="newEvent.bgColor" id="event-bg-color" ref="eCColor"/>
					<FormInputFeedback type="invalid">
						{{ eCFormInputFeedbacks.bgColor }}
					</FormInputFeedback>

					<FloatingInput 
						id="event-start-date"
						v-model="newEvent.startDate"
						label="Digite a data de ínicio *"
						type="date"
						ref="eCStartDate"
					>
						<FormInputFeedback type="invalid">
							{{ eCFormInputFeedbacks.startDate }}
						</FormInputFeedback>
					</FloatingInput>

					<FloatingInput 
						id="event-end-date"
						v-model="newEvent.endDate"
						label="Digite a data de fim"
						type="date"
						ref="eCEndDate"
					>
						<FormInputFeedback type="invalid">
							{{ eCFormInputFeedbacks.endDate }}
						</FormInputFeedback>
					</FloatingInput>

					<div v-if="newEvent.label != 'H'">
						<BaseLabel for="event-campi"> Esse evento é válido para os campi: </BaseLabel>
						<BaseSelectInput 
							id="event-campi" 
							:options="campi" 
							v-model="newEvent.campi"
							:multiple="true"
							ref="eCCampi"
						/>
						<FormInputFeedback type="invalid">
							{{ eCFormInputFeedbacks.campi }}
						</FormInputFeedback>
					</div>
					
					

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

		<BaseToastContainer class="position-fixed bottom-0 end-0 p-3">
            <BaseToast 
                title="Sucesso" 
                :message="sucessToast.msg" 
                id="sucess-toast" 
                class="text-bg-success" />

            <BaseToast 
                title="Erro" 
                :message="errorToast.msg" 
                id="fail-toast" 
                class="text-bg-danger" />    

        </BaseToastContainer>
	</div>
</template>

<script>
	/* eslint-disable no-console */
	import ToastUICalendar from "@/components/ToastUICalendar.vue"
	import "@toast-ui/calendar/toastui-calendar.css"
	import { TZDate } from '@toast-ui/calendar';

	import { theme } from "@/views/assets/theme.js"

	import axios from "axios"
	import * as bootstrap from 'bootstrap'

	import { mapStores } from "pinia"
	import { useUserAuthInfoStore } from "@/stores/userAuthInfo"
	import { useOrganizationInfoStore } from "@/stores/organizationInfo"

	import BaseButton from "@/components/BaseButton.vue"
	import BaseModal from '@/components/BaseModal.vue'
	import BaseForm from '@/components/BaseForm.vue'
	import FloatingInput from '@/components/FloatingInput.vue'
	import BaseSelectInput from '@/components/BaseSelectInput.vue'
	import BaseLabel from '@/components/BaseLabel.vue'
	import ColorPicker from '@/components/ColorPicker.vue'
	import BaseToastContainer from '@/components/BaseToastContainer.vue'
    import BaseToast from '@/components/BaseToast.vue'
	import FormInputFeedback from '@/components/FormInputFeedback.vue'

	import refreshUserAuthToken from '@/assets/scripts/refreshUserAuthToken.js'

	export default {
		data() {
			return {
				//TODO: retirar esse mock
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
					//TODO: verificar pra que isso serve
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
					//TODO: remover outras opções além de mês
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
					label: "SD",
					bgColor: "#3473b7",
					campi: []
				},
				eventLabels: [
					{value: 'H', label: 'Feriado Nacional'},
					{value: 'RH', label: 'Feriado Local'},
					{value: 'NSS', label: 'Sábado não-letivo'},
					{value: 'NSD', label: 'Dia(s) não-letivo(s)'},
					{value: 'SD', label: 'Dia(s) letivo(s)', selected: true},
				],
				monthsNames: {
					1: "Janeiro",
					2: "Fevereiro",
					3: "Março",
					4: "Abril",
					5: "Maio",
					6: "Junho",
					7: "Julho",
					8: "Agosto",
					9: "Setembro",
					10: "Outubro",
					11: "Novembro",
					12: "Dezembro",
				},
				campi: [],
				eventCreationModal: null,
				sucessToast: {
					el: null,
					msg: ""
				},
				errorToast: {
					el: null,
					msg: ""
				},
				eCFormInputFeedbacks: {
					description: "",
					startDate: "",
					endDate: "",
					label: "",
					bgColor: "",
					campi: ""
				}
			}
		},
		computed: {
			calendarInstance() {
				return this.$refs.calendar.getInstance();
			},
			...mapStores(useUserAuthInfoStore, useOrganizationInfoStore)
		},
		watch: {
			selectedView(newView) {
				this.calendarInstance.changeView(newView);
				this.setDateRangeText();
			},
			campi(value) {
				value.forEach((campus) => {
					this.newEvent.campi.push(campus.value)
				})
				
			}
		},
		mounted() {
			this.setDateRangeText();
			this.getEvents();

			this.organizationInfoStore.$subscribe((mutation, state) => {
				this.campi = [];

				state.campi.forEach( (campus) => {
					this.campi.push({
						value: campus.id,
						label: campus.name
					})
				})
			})

			this.eventCreationModal = bootstrap.Modal.getOrCreateInstance('#createEvents');
			this.sucessToast.el = bootstrap.Toast.getOrCreateInstance("#sucess-toast");
			this.errorToast.el = bootstrap.Toast.getOrCreateInstance("#fail-toast");
		},
		methods: {
			getEvents() {
				axios.get(`/api/academic-calendar/calendar/${this.$route.params.id}/events`, {
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
							backgroundColor: event.hexadecimal_color,
							campi: event.campi,
							organization: event.organization,
							isAllday: true,
						});
					});
				});
				// TODO: Adicionar tratamento de erro
			},
			createEvent() {
				var payload = {
					'academic_calendar': this.$route.params.id,
					'label': this.newEvent.label,
					'description': this.newEvent.description,
					'hexadecimal_color': this.newEvent.bgColor,
					'start_date': this.newEvent.startDate,
					'campi': this.newEvent.campi,
					'end_date': this.newEvent.endDate !== ""? this.newEvent.endDate : this.newEvent.startDate
				}

				axios.post(`/api/academic-calendar/event/create`, payload, 
					{
						headers: {
							Authorization: "Bearer " + this.userAuthInfoStore.token
						}
					}
				).then((response) => {
					this.eventCreationModal.hide()

					this.sucessToast.msg = "Evento criado com sucesso!"

					this.sucessToast.el.show()

					this.events.push({
						id: response.data.id,
						calendarId: "0",
						title: this.newEvent.description,
						category: "allday",
						start: this.newEvent.startDate,
						end: response.data.end_date,
						label: this.newEvent.label,
						backgroundColor: this.newEvent.bgColor,
						campi: this.newEvent.campi,
						organization: response.data.organization,
						isAllday: true,
					});
				}).catch((error) => {
					// TODO: Adicionar tratamento de erro
					console.log(error)
					if(error.response) {
                        if(error.request.status === 401) {
                            refreshUserAuthToken(this.createEvent)
							//TODO Exibir um toast quando o usuário for redirecionado pro login
                        }
                        else if(error.request.status === 422 ){
							if(Object.hasOwn(error.response.data, 'description')) {
								error.response.data["description"].forEach( (msg) => {
									this.eCFormInputFeedbacks.description += `${msg}\n`
								})
								this.$refs.eCDescription.validate("invalid")
                            }
							if(Object.hasOwn(error.response.data, 'label')) {
								error.response.data["label"].forEach( (msg) => {
									this.eCFormInputFeedbacks.label += `${msg}\n`
								})
								this.$refs.ecLabel.validate("invalid")
                            }
                            if(Object.hasOwn(error.response.data, 'campi')) {
								error.response.data["campi"].forEach( (msg) => {
									this.eCFormInputFeedbacks.campi += `${msg}\n`
								})
								this.$refs.eCCampi.validate("invalid")
                            }
                            if(Object.hasOwn(error.response.data, 'end_date')) {
								error.response.data["end_date"].forEach( (msg) => {
									this.eCFormInputFeedbacks.endDate += `${msg}\n`
								})
								this.$refs.eCEndDate.validate("invalid")
                            }
                            if(Object.hasOwn(error.response.data, 'start_date')) {
								error.response.data["start_date"].forEach( (msg) => {
									this.eCFormInputFeedbacks.startDate += `${msg}\n`
								})
								this.$refs.eCStartDate.validate("invalid")
                            }
							if(Object.hasOwn(error.response.data, 'hexadecimal_color')) {
								error.response.data["hexadecimal_color"].forEach( (msg) => {
									this.eCFormInputFeedbacks.bgColor += `${msg}\n`
								})
								this.$refs.eCColor.validate("invalid")
                            }
							if(Object.hasOwn(error.response.data, 'academic_calendar')) {
								this.errorToast.msg = "Não foi possível criar esse evento nesse calendário!"
								this.errorToast.el.show()
							}
                        }
                        else if(error.request.status === 500){
                            this.errorToastMsg = "Não foi possível se conectar com o servidor."
                            toast.show()
                        }
                    }
                    else if(error.request) {
                        if(error.code === "ERR_NETWORK") {
                            this.errorToastMsg = "Esse cliente não consegue se conectar com a internet."
                            toast.show()
                        }
                    }
                    else {
                        console.log(error)
                        this.errorToastMsg = "Um erro inesperado aconteceu. Por favor, recarregue a página e tente novamente."
                        toast.show()
                    }
				})
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
				console.log(eventData);
				const event = {
					calendarId: eventData.calendarId || "",
					id: eventData.id,
					title: eventData.title,
					isAllday: eventData.isAllday,
					start: eventData.start,
					end: eventData.end,
					category: eventData.isAllday ? "allday" : "time",
					label: eventData.label,
					backgroundColor: eventData.bgColor,
					campi: eventData.campi,
					organization: eventData.organization
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

				this.dateRangeText = `${this.monthsNames[date.getMonth() + 1]} de ${date.getFullYear()}`;
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
			ColorPicker: ColorPicker,
			BaseToastContainer: BaseToastContainer,
			BaseToast: BaseToast,
			FormInputFeedback: FormInputFeedback
		},
	};
</script>
