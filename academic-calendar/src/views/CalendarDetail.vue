<template>
	<div>
		<TextTitle1 ref="calendarTitle">
			{{ calendar.description }}
		</TextTitle1>
		
		<ToolBar>
			<ToolBarItem class="col-3">
					<span id="month-name">
						{{ dateRangeText }}  
					</span>
					<ButtonGroup>
						<BaseButton type="button" @click.native="onClickMoveButton(-1)">
							<IconPrevArrow />
						</BaseButton>
						<BaseButton type="button" @click.native="onClickMoveButton(1)">
							<IconNextArrow />
						</BaseButton>
					</ButtonGroup>
			</ToolBarItem>
			<ToolBarItem>
				<BaseButton type="button" @click.native="onClickTodayButton"> <i class="bi bi-calendar4-event"></i> Hoje </BaseButton>
			</ToolBarItem>
			<ToolBarItem>
				<BaseButton data-bs-toggle="modal" data-bs-target="#createEvents" type="button" >
					<i class="bi bi-plus-lg"></i> Evento
				</BaseButton>
			</ToolBarItem>
			<ToolBarItem>
				<BaseAnchor :href="$router.resolve({ name: 'semester-creation', params: {calendar_id: $route.params.id}}).href">
					<i class="bi bi-plus-lg"></i> Semestre
				</BaseAnchor>
			</ToolBarItem>
			<ToolBarItem class="col-2">
				<DropdownMenu> 
					<ButtonGroup>
						<BaseButton type="button"  @click.native="downloadCalendar('xlsx')">
							<i class="bi bi-download"></i>  Exportar planilha 
						</BaseButton>
						<BaseButton type="button" class="dropdown-toggle dropdown-toggle-split">
							<span class="visually-hidden">Ativar Dropdown</span>
						</BaseButton>
					</ButtonGroup>
					<template v-slot:options>
						<DropdownItem>
							<BaseButton type="button" @click.native="downloadCalendar('csv')"> Exportar arquivo .csv</BaseButton>
						</DropdownItem>
					</template>
				</DropdownMenu>
			</ToolBarItem>
			<ToolBarItem>
				<BaseButton data-bs-toggle="modal" data-bs-target="#importEvents" type="button">
					<i class="bi bi-box-arrow-up"></i> Importe eventos
				</BaseButton>
			</ToolBarItem>
			
		</ToolBar>
		
		<h1 class="date-range"></h1>

		<ToastUICalendar
			ref="calendar"
			style="height: 1200px; width: 100%"
			:view="'month'"
			:use-form-popup="false"
			:use-detail-popup="false"
			:week="{
				showTimezoneCollapseButton: true,
				timezonesCollapsed: false,
				eventView: true,
				taskView: true,
			}"
			:month="{ startDayOfWeek: 7, visibleEventCount: 10, visibleWeeksCount: 5, dayNames: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'sáb'] }"
			:timezone="{  }"
			:theme="theme"
			:template="{
				allday: getTemplateForAllday,
			}"
			:grid-selection="true"
			:calendars="calendars"
			:events="events"
			@selectDateTime="onSelectDateTime"
			@beforeCreateEvent="onBeforeCreateEvent"
			@beforeUpdateEvent="onBeforeUpdateEvent"
			@beforeDeleteEvent="onBeforeDeleteEvent"
			@clickEvent="onClickEvent"
		/>

		<Page>
			<TextTitle5>
				<span>DIAS LETIVOS – QUADRO SÍNTESE</span>
			</TextTitle5>
			<EmptyState v-if="semesters.length == 0" msg="Essa visualização só está disponível quando há semestres no calendário." />

			<BaseTable v-if="semesters.length > 0">
				<template v-slot:head>
					<BaseTHead>
						<tr>
							<BaseTH>Local</BaseTH>
							<BaseTH v-for="semester in summaryTable.semesters" :key="semester.description">
								{{ semester.description }}
							</BaseTH>
						</tr>
					</BaseTHead>
				</template>

				<template  v-slot:body>
					<BaseTBody>
						<tr v-for="campus in campi" :key="campus.id">
							<td> {{ campus.label }}</td>
							<td v-for="semester in summaryTable.semesters" :key="semester.description">
								<span v-for="c in semester.campi_school_days_count" :key="semester.description + c.id">
									<span v-if="c.id === campus.value">
										{{ c.school_days_count }}
									</span>
								</span>
							</td>
						</tr>
					</BaseTBody>
				</template>
			</BaseTable>
		</Page>

		<Page>
			<TextTitle5>
				Semestres
			</TextTitle5>

			<EmptyState v-if="semesters.length == 0" msg="Essa visualização só está disponível quando há semestres no calendário." />

			<BaseUnorderedList  v-if="semesters.length > 0">
				<BaseListItem v-for="semester in semesters" :key="semester.id">
					{{ semester.description }} | Inicia em {{ semester.start_date.toLocaleDateString() }} e termina em {{ semester.end_date.toLocaleDateString() }}

					<template v-slot:post-item-section>
						<BaseButton @click.native="$router.push({name: 'semester-update', params: { id: semester.id }})" type="button" class="btn-outline-success">
							<i class="bi bi-pencil-square"></i>
							<span class="visually-hidden">Editar semestre</span>
						</BaseButton>
					</template>
				</BaseListItem>
			</BaseUnorderedList>
		</Page>

		<BaseModal id="createEvents">
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
						<MultipleSelectInput 
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
				<BaseButton type="submit" form="event-creation-form"  class="btn btn-primary">
					<i class="bi bi-plus-lg"></i> Criar
				</BaseButton>
			</template>
		</BaseModal>

		<BaseModal id="editEvent">
			<template v-slot:modal-title>
				<TextTitle5>
					{{selectedEvent.description}}
				</TextTitle5>
			</template>

			<template v-slot:modal-body>
				<BaseForm @submit="editEvent" id="event-edit-form" type="feedback" ref="eEForm" novalidate>
					<FloatingInput 
						ref="eEDescription"
						id="selected-event-description"
						v-model="selectedEvent.description"
						label="Digite o nome do evento"
						type="text"
						maxlength="500"
					>
						<FormInputFeedback type="invalid">
							{{ eEFormInputFeedbacks.description }}
						</FormInputFeedback>
					</FloatingInput>
					

					<BaseLabel for="selected-event-label"> Escolha o tipo do evento: </BaseLabel>
					<BaseSelectInput 
						ref="eELabel"
						id="event-label" 
						:options="eventLabels" 
						v-model="selectedEvent.label"
					/>
					<FormInputFeedback type="invalid">
						{{ eEFormInputFeedbacks.label }}
					</FormInputFeedback>

					<BaseLabel for="selected-event-bg-color"> Escolha a cor de fundo: </BaseLabel>
					<ColorPicker v-model="selectedEvent.bgColor" id="selected-event-bg-color" ref="eEColor"/>
					<FormInputFeedback type="invalid">
						{{ eEFormInputFeedbacks.bgColor }}
					</FormInputFeedback>

					<FloatingInput 
						id="selected-event-start-date"
						v-model="selectedEvent.startDate"
						label="Digite a data de ínicio *"
						type="date"
						ref="eEStartDate"
					>
						<FormInputFeedback type="invalid">
							{{ eEFormInputFeedbacks.startDate }}
						</FormInputFeedback>
					</FloatingInput>

					<FloatingInput 
						id="selected-event-end-date"
						v-model="selectedEvent.endDate"
						label="Digite a data de fim"
						type="date"
						ref="eEEndDate"
					>
						<FormInputFeedback type="invalid">
							{{ eEFormInputFeedbacks.endDate }}
						</FormInputFeedback>
					</FloatingInput>

					<div v-if="selectedEvent.label != 'H'">
						<BaseLabel for="selected-event-campi"> Esse evento é válido para os campi: </BaseLabel>
						<MultipleSelectInput 
							id="selected-event-campi" 
							:options="campi" 
							v-model="selectedEvent.campi"
							ref="eECampi"
						/>
						<FormInputFeedback type="invalid">
							{{ eEFormInputFeedbacks.campi }}
						</FormInputFeedback>
					</div>
				</BaseForm>
			</template>

			<template v-slot:modal-footer>
				<ButtonGroup>
					<BaseButton class="btn-outline-danger" data-bs-toggle="modal" data-bs-target="#deleteEvent" type="button">
						<i class="bi bi-trash3"></i> Excluir
					</BaseButton>
					<BaseButton class="btn-outline-success" type="submit" form="event-edit-form" >
						<i class="bi bi-check2"></i> Editar
					</BaseButton>
				</ButtonGroup>
			</template>
		</BaseModal>

		<BaseModal id="importEvents">
			<template v-slot:modal-title>
				<TextTitle5>
					Importar eventos
				</TextTitle5>
			</template>

			<template v-slot:modal-body>
				<div>
					<p>
						É possível importar vários eventos de uma única vez através de um arquivo Excel(.xlsx)
					</p>
					<p>
						Baixe aqui um exemplo de uma planilha: 
						<BaseAnchor href="/public/planilha_de_exemplo.xlsx" download>Clique aqui para baixar</BaseAnchor>
					</p>
					<p>
						Explicação de cada coluna da planilha e exemplos: 
						<router-link :to="{ name: 'event-file-explanation'}">Clique aqui acessar</router-link>
					</p>
				</div>
				
				<BaseForm @submit="importEvents" id="event-import-form" ref="eIForm" novalidate>
					<BaseLabel for="event-file">Selecione um arquivo Excel</BaseLabel>
					<BaseInput 
						@change.native="handleFileChange"
						id="event-file"
						type="file"
						accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
						required
					>
					</BaseInput>

					<BaseCallout v-if="importingError.isErrored" class="callout-danger">
						<h3>Atenção aos erros abaixo:</h3>
						<div v-for="message in importingError.messages">
							{{ message }}
						</div>
					</BaseCallout>
					
				</BaseForm>
			</template>

			<template v-slot:modal-footer>
				<BaseButton type="submit" form="event-import-form"  class="btn btn-primary" :disabled="selectedFile === null || selectedFile === undefined">
					<i class="bi bi-box-arrow-up"></i> Importar
				</BaseButton>
			</template>
		</BaseModal>

		<BaseModal id="deleteEvent">
			<template v-slot:modal-title>
				<TextTitle5>
					Confirmação de exclusão
				</TextTitle5>
			</template>

			<template v-slot:modal-body>
				<div v-if="['H', 'RH'].includes(selectedEvent.label)">
					Tem certeza que deseja excluir esse feriado? 
					Ele também será excluído de todos os outros calendários.
					<br/>
					Essa ação não é reversível.
				</div>
				<div v-else>
					Tem certeza que deseja excluir esse evento? 
					<br/>
					Essa ação não é reversível.
				</div>
			</template>

			<template v-slot:modal-footer>
				<div>
					<BaseButton type="button"  class="btn btn-primary" @click.native="deleteEvent(selectedEvent)">
						Confirmar
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

			<BaseToast 
                title="Aguarde" 
                :message="infoToast.msg" 
                id="info-toast" 
                class="text-bg-info" 
				data-bs-delay='50000'
				/>    

        </BaseToastContainer>
	</div>
</template>
<style scoped>
	#month-name {
		min-width: 50%;
	}
</style>
<script>
	/* eslint-disable no-console */
	import ToastUICalendar from "@/components/ToastUICalendar.vue"
	import "@toast-ui/calendar/toastui-calendar.css"

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
    import DropdownButton from '@/components/DropdownButton.vue'
	import TextTitle1 from '@/components/text-components/TextTitle1.vue'
	import TextTitle5 from '@/components/text-components/TextTitle5.vue'
	import MultipleSelectInput from '@/components/MultipleSelectInput.vue'
	import BaseUnorderedList from '@/components/BaseUnorderedList.vue'
	import BaseListItem from '@/components/BaseListItem.vue'
	import BaseTable from '@/components/BaseTable.vue'
	import BaseTHead from '@/components/BaseTHead.vue'
	import BaseTBody from '@/components/BaseTBody.vue'
	import BaseTH from '@/components/BaseTH.vue'
	import BaseInput from '@/components/BaseInput.vue'
	import BaseAnchor from "@/components/BaseAnchor.vue"
	import BaseCallout from "@/components/BaseCallout.vue"
	import ToolBar from "@/components/ToolBar.vue"
	import ToolBarItem from "@/components/ToolBarItem.vue"
	import Page from "@/components/Page.vue"
	import EmptyState from "@/components/EmptyState.vue"
	import ButtonGroup from "@/components/ButtonGroup.vue"
	import IconNextArrow from "@/components/icons/IconNextArrow.vue"
	import IconPrevArrow from "@/components/icons/IconPrevArrow.vue"
	import PlusIcon from "@/components/icons/PlusIcon.vue"
	import DropdownMenu from "@/components/DropdownMenu.vue"
	import DropdownItem from "@/components/DropdownItem.vue"

	import refreshUserAuthToken from '@/assets/scripts/refreshUserAuthToken.js'

	export default {
		data() {
			return {
				calendars: [
					{
						"name": "Private",
						"backgroundColor": "#9e5fff",
						"id": this.$route.params.id,
						"borderColor": "#9e5fff",
						"dragBackgroundColor": "#9e5fff"
					}
				],
				calendar: {
					id: null,
					description: null,
					startDate: null,
					endDate: null,
					organization: null
				},
				events: [],
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
				infoToast: {
					el: null,
					msg: "Baixando seu arquivo..."
				},
				eCFormInputFeedbacks: {
					description: "",
					startDate: "",
					endDate: "",
					label: "",
					bgColor: "",
					campi: ""
				},
				selectedEvent: {
					id: null,
					description: "",
					startDate: "",
					endDate: "",
					label: "SD",
					bgColor: "#3473b7",
					campi: [],
					internalEvent: null
				},
				eEFormInputFeedbacks: {
					description: "",
					startDate: "",
					endDate: "",
					label: "",
					bgColor: "",
					campi: ""
				},
				eventEditModal: null,
				editRequest: null,
				eventExcludeModal: null,
				importingModal: null,
				semesters: [],
				summaryTable: {},
				selectedFile: null,
				importingError: {
					messages: [],
					isErrored: false
				}
			}
		},
		computed: {
			calendarInstance() {
				return this.$refs.calendar.getInstance();
			},
			...mapStores(useUserAuthInfoStore, useOrganizationInfoStore)
		},
		mounted() {
			this.calendar.id = this.$route.params.id;

			this.parseCampiFromStore(this.organizationInfoStore.campi);

			this.setDateRangeText();

			this.getCalendarDetail();

			this.getEvents();

			this.getSemesters();

			this.getCalendarSummary();

			this.organizationInfoStore.$subscribe((mutation, state) => {
				this.campi = [];
				this.parseCampiFromStore(state.campi);
			})

			this.eventCreationModal = bootstrap.Modal.getOrCreateInstance('#createEvents');
			this.eventEditModal = bootstrap.Modal.getOrCreateInstance('#editEvent');
			this.eventExcludeModal = bootstrap.Modal.getOrCreateInstance('#deleteEvent');
			this.importingModal = bootstrap.Modal.getOrCreateInstance('#importEvents');
			this.sucessToast.el = bootstrap.Toast.getOrCreateInstance("#sucess-toast");
			this.errorToast.el = bootstrap.Toast.getOrCreateInstance("#fail-toast");
			this.infoToast.el = bootstrap.Toast.getOrCreateInstance("#info-toast");
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
							calendarId: this.calendar.id,
							title: event.description,
							category: "allday",
							start: event.start_date,
							startDate: event.start_date,
							end: event.end_date,
							endDate: event.end_date,
							label: event.label,
							backgroundColor: event.hexadecimal_color,
							campi: event.campi,
							organization: event.organization,
							isAllday: true,
						});
					});
				}).catch((error) => {
					if(error.response) {
                        if(error.request.status === 401) {
                            refreshUserAuthToken(this.getEvents)
                        }
                        else if(error.request.status === 500){
                            this.errorToast.msg = "Não foi possível se conectar com o servidor."
                            this.errorToast.el.show()
                        }
                    }
                    else if(error.request) {
                        if(error.code === "ERR_NETWORK") {
                            this.errorToast.msg = "Esse cliente não consegue se conectar com a internet."
                            this.errorToast.el.show()
                        }
                    }
                    else {
                        console.log(error)
                        this.errorToast.msg = "Um erro inesperado aconteceu. Por favor, recarregue a página e tente novamente."
                        this.errorToast.el.show()
                    }
				})
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
					this.newEvent = {
						description: "",
						startDate: "",
						endDate: "",
						label: "SD",
						bgColor: "#3473b7",
						campi: []
					},

					this.events.push({
						id: response.data.id,
						calendarId: this.calendar.id,
						title: response.data.description,
						category: "allday",
						startDate: response.data.start_date,
						start: response.data.start_date,
						endDate: response.data.end_date,
						end: response.data.end_date,
						label: response.data.label,
						backgroundColor: response.data.hexadecimal_color,
						campi: response.data.campi,
						organization: response.data.organization,
						isAllday: true,
					});

					this.eventCreationModal.hide()

					this.sucessToast.msg = "Evento criado com sucesso!"

					this.sucessToast.el.show()

					this.getCalendarSummary();
				}).catch((error) => {
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
                            this.errorToast.msg = "Não foi possível se conectar com o servidor."
                            this.errorToast.el.show()
                        }
                    }
                    else if(error.request) {
                        if(error.code === "ERR_NETWORK") {
                            this.errorToast.msg = "Esse cliente não consegue se conectar com a internet."
                            this.errorToast.el.show()
                        }
                    }
                    else {
                        console.log(error)
                        this.errorToast.msg = "Um erro inesperado aconteceu. Por favor, recarregue a página e tente novamente."
                        this.errorToast.el.show()
                    }
				})
			},
			getCalendarDetail() {
				axios.get(`/api/academic-calendar/calendar/detail/${this.calendar.id}`, {
					headers: {
						Authorization: "Bearer " + this.userAuthInfoStore.token,
					}
				})
				.then((res) => {
					this.calendar.description =  res.data.description
					this.calendar.startDate =  res.data.start_date
					this.calendar.endDate =  res.data.end_date
					this.calendar.organization =  res.data.organization
				})
				.catch( (error) => {
					if(error.response) {
                        if(error.request.status === 401) {
                            refreshUserAuthToken(this.getCalendarDetail)
							//TODO Exibir um toast quando o usuário for redirecionado pro login
                        }
                        else if(error.request.status === 404 ){
							this.$router.push({ name: 'not-found' })
                        }
                        else if(error.request.status === 500){
                            this.errorToast.msg = "Não foi possível se conectar com o servidor."
                            this.errorToast.el.show()
                        }
                    }
                    else if(error.request) {
                        if(error.code === "ERR_NETWORK") {
                            this.errorToast.msg = "Esse cliente não consegue se conectar com a internet."
                            this.errorToast.el.show()
                        }
                    }
                    else {
                        console.log(error)
                        this.errorToast.msg = "Um erro inesperado aconteceu. Por favor, recarregue a página e tente novamente."
                        this.errorToast.el.show()
                    }
				})
			},
			editEvent() {
				var payload = {
					'academic_calendar': this.calendar.id,
					'label': this.selectedEvent.label,
					'description': this.selectedEvent.description,
					'hexadecimal_color': this.selectedEvent.bgColor,
					'start_date': this.selectedEvent.startDate,
					'campi': this.selectedEvent.campi,
					'end_date': this.selectedEvent.endDate !== ""? this.selectedEvent.endDate : this.selectedEvent.startDate
				}

				axios.put(`/api/academic-calendar/event/${this.selectedEvent.id}/edit`, payload, 
					{
						headers: {
							Authorization: "Bearer " + this.userAuthInfoStore.token
						}
					}
				).then((_) => {
					this.eventEditModal.hide()

					this.sucessToast.msg = "Evento atualizado com sucesso!"

					this.sucessToast.el.show()

					this.selectedEvent.internalEvent.label = this.selectedEvent.label
					this.selectedEvent.internalEvent.start = this.selectedEvent.startDate
					this.selectedEvent.internalEvent.end = payload.end_date
					this.selectedEvent.internalEvent.title = this.selectedEvent.description
					this.selectedEvent.internalEvent.backgroundColor = this.selectedEvent.bgColor
					this.selectedEvent.internalEvent.campi = this.selectedEvent.campi

					this.calendarInstance.updateEvent(this.selectedEvent.id, this.calendar.id, {
						label: this.selectedEvent.label,
						start: this.selectedEvent.startDate,
						end:payload.end_date,
						title: this.selectedEvent.description,
						backgroundColor: this.selectedEvent.bgColor,
					});

					this.getCalendarSummary();

				}).catch((error) => {
					if(error.response) {
                        if(error.request.status === 401) {
                            refreshUserAuthToken(this.editEvent)
							//TODO Exibir um toast quando o usuário for redirecionado pro login
                        }
                        else if(error.request.status === 422 ){
							this.eEFormInputFeedbacks.description = ""
							this.eEFormInputFeedbacks.label = ""
							this.eEFormInputFeedbacks.campi = ""
							this.eEFormInputFeedbacks.endDate = ""
							this.eEFormInputFeedbacks.startDate = ""
							this.eEFormInputFeedbacks.bgColor = ""

							this.$refs.eEDescription.resetValidation()
							this.$refs.eELabel.resetValidation()

							if(this.selectedEvent.label != "H") {
								this.$refs.eECampi.resetValidation()
							}
							
							this.$refs.eEEndDate.resetValidation()
							this.$refs.eEStartDate.resetValidation()
							this.$refs.eEColor.resetValidation()

							if(Object.hasOwn(error.response.data, 'description')) {
								error.response.data["description"].forEach( (msg) => {
									this.eEFormInputFeedbacks.description += `${msg}\n`
								})
								this.$refs.eEDescription.validate("invalid")
                            }
							if(Object.hasOwn(error.response.data, 'label')) {
								error.response.data["label"].forEach( (msg) => {
									this.eEFormInputFeedbacks.label += `${msg}\n`
								})
								this.$refs.eELabel.validate("invalid")
                            }
                            if(Object.hasOwn(error.response.data, 'campi')) {
								error.response.data["campi"].forEach( (msg) => {
									this.eEFormInputFeedbacks.campi += `${msg}\n`
								})
								this.$refs.eECampi.validate("invalid")
                            }
                            if(Object.hasOwn(error.response.data, 'end_date')) {
								error.response.data["end_date"].forEach( (msg) => {
									this.eEFormInputFeedbacks.endDate += `${msg}\n`
								})
								this.$refs.eEEndDate.validate("invalid")
                            }
                            if(Object.hasOwn(error.response.data, 'start_date')) {
								error.response.data["start_date"].forEach( (msg) => {
									this.eEFormInputFeedbacks.startDate += `${msg}\n`
								})
								this.$refs.eEStartDate.validate("invalid")
                            }
							if(Object.hasOwn(error.response.data, 'hexadecimal_color')) {
								error.response.data["hexadecimal_color"].forEach( (msg) => {
									this.eEFormInputFeedbacks.bgColor += `${msg}\n`
								})
								this.$refs.eEColor.validate("invalid")
                            }
							if(Object.hasOwn(error.response.data, 'academic_calendar')) {
								this.errorToast.msg = "Não foi possível atualizar esse evento nesse calendário"
								this.errorToast.el.show()
							}
                        }
                        else if(error.request.status === 500){
                            this.errorToast.msg = "Não foi possível se conectar com o servidor."
                            this.errorToast.el.show()
                        }
                    }
                    else if(error.request) {
                        if(error.code === "ERR_NETWORK") {
                            this.errorToast.msg = "Esse cliente não consegue se conectar com a internet."
                            this.errorToast.el.show()
                        }
						else {
							console.log(error)
							this.errorToast.msg = "Um erro inesperado aconteceu. Por favor, recarregue a página e tente novamente."
							this.errorToast.el.show()
						}
                    }
                    else {
                        console.log(error)
                        this.errorToast.msg = "Um erro inesperado aconteceu. Por favor, recarregue a página e tente novamente."
                        this.errorToast.el.show()
                    }
				})
			},
			deleteEvent(event) {
				axios.delete(`/api/academic-calendar/event/${event.id}/delete`, 
					{
						headers: {
							Authorization: "Bearer " + this.userAuthInfoStore.token
						}
					}
				).then(() => {
					var eventIndex = this.events.findIndex((ev) => ev.id === event.id)

					this.events.splice(eventIndex, 1);

					this.selectedEvent.internalEvent = null;

					this.eventExcludeModal.hide()

					this.sucessToast.msg = "O evento foi excluído com sucesso."

					this.sucessToast.el.show()

					this.getCalendarSummary()
				}).catch((error) => {
					if(error.response) {
							if(error.request.status === 401) {
								refreshUserAuthToken(this.deleteEvent, [event])
							}
							else if(error.request.status === 404){
								this.errorToast.msg = "Não foi possível se conectar com o servidor."
								this.errorToast.el.show()
							}
							else if(error.request.status === 500){
								this.errorToast.msg = "Não foi possível se conectar com o servidor."
								this.errorToast.el.show()
							}
						}
					else if(error.request) {
						if(error.code === "ERR_NETWORK") {
							this.errorToast.msg = "Esse cliente não consegue se conectar com a internet."
							this.errorToast.el.show()
						}
						else {
							console.log(error)
							this.errorToast.msg = "Um erro inesperado aconteceu. Por favor, recarregue a página e tente novamente."
							this.errorToast.el.show()
						}
					}
					else {
						console.log(error)
						this.errorToast.msg = "Um erro inesperado aconteceu. Por favor, recarregue a página e tente novamente."
						this.errorToast.el.show()
					}
				})
			},
			getSemesters(){
				axios.get(`/api/academic-calendar/calendar/${this.$route.params.id}/semesters`, {
					headers: {
						Authorization: "Bearer " + this.userAuthInfoStore.token,
					},
				}).then((res) => {
					this.semesters = [];
					res.data.forEach((semester) => {
						semester.start_date = new Date(`${semester.start_date}T00:00:00`)
						semester.end_date = new Date(`${semester.end_date}T00:00:00`)
						this.semesters.push(semester)
					})

				}).catch((error) => {
					if(error.response) {
                        if(error.request.status === 401) {
                            refreshUserAuthToken(this.getSemesters)
                        }
                        else if(error.request.status === 500){
                            this.errorToast.msg = "Não foi possível se conectar com o servidor."
                            this.errorToast.el.show()
                        }
                    }
                    else if(error.request) {
                        if(error.code === "ERR_NETWORK") {
                            this.errorToast.msg = "Esse cliente não consegue se conectar com a internet."
                            this.errorToast.el.show()
                        }
                    }
                    else {
                        console.log(error)
                        this.errorToast.msg = "Um erro inesperado aconteceu. Por favor, recarregue a página e tente novamente."
                        this.errorToast.el.show()
                    }
				})
			},
			getCalendarSummary(){
				axios.get(`/api//academic-calendar/${this.$route.params.id}/school_days_count`, {
					headers: {
						Authorization: "Bearer " + this.userAuthInfoStore.token,
					},
				}).then((res) => {
					this.summaryTable = res.data;

				}).catch((error) => {
					if(error.response) {
                        if(error.request.status === 401) {
                            refreshUserAuthToken(this.getSemesters)
                        }
                        else if(error.request.status === 500){
                            this.errorToast.msg = "Não foi possível se conectar com o servidor."
                            this.errorToast.el.show()
                        }
                    }
                    else if(error.request) {
                        if(error.code === "ERR_NETWORK") {
                            this.errorToast.msg = "Esse cliente não consegue se conectar com a internet."
                            this.errorToast.el.show()
                        }
                    }
                    else {
                        console.log(error)
                        this.errorToast.msg = "Um erro inesperado aconteceu. Por favor, recarregue a página e tente novamente."
                        this.errorToast.el.show()
                    }
				})
			},
			getTemplateForAllday(event) {
				return `<span style="text-shadow: 0 0 9px #fff !important;">${event.title}</span>`;
			},
			onSelectDateTime({ start, end }) {

				this.newEvent.startDate = start.toISOString().split("T")[0];
				this.newEvent.endDate = end.toISOString().split("T")[0];
				this.newEvent.description = ""
				this.newEvent.campi = []
				this.newEvent.bgColor = "#FFFFFF"

				this.eventCreationModal.show()

				this.calendarInstance.clearGridSelections()
				
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
				//coloquei esse if aqui por que o TUI chama esse evento 6 vezes quando atualiza a data final
				if(this.editRequest === null) {

					const targetEvent = updateData.event;
					const changes = { ...updateData.changes };
					
					var internalEvent = this.events.find((e) => e.id === targetEvent.id)

					var payload = {
						'academic_calendar': this.calendar.id,
						'label': internalEvent.label,
						'description': internalEvent.title,
						'hexadecimal_color': internalEvent.backgroundColor,
						'start_date': internalEvent.startDate,
						'campi': internalEvent.campi,
						'end_date': internalEvent.endDate
					}

					if(Object.hasOwn(changes, 'start')) {
						payload.start_date = this.formatDate(changes.start.toDate())
					}

					if(Object.hasOwn(changes, 'end')) {
						payload.end_date = this.formatDate(changes.end.toDate())
					}

					this.editRequest = axios.put(`/api/academic-calendar/event/${internalEvent.id}/edit`, payload, 
						{
							headers: {
								Authorization: "Bearer " + this.userAuthInfoStore.token
							}
						}
					).then((_) => {
						var index = this.events.findIndex((ev) => ev.id === internalEvent.id)
						this.events[index].startDate = payload.start_date
						this.events[index].start = changes.start
						this.events[index].endDate = payload.end_date
						this.events[index].end = changes.end
						
						this.calendarInstance.updateEvent(targetEvent.id, this.calendar.id, changes);

						this.eventEditModal.hide()

						this.sucessToast.msg = "Evento atualizado com sucesso!"

						this.sucessToast.el.show()

						this.getCalendarSummary();

					}).catch((error) => {
						if(error.response) {
							if(error.request.status === 401) {
								refreshUserAuthToken(this.onBeforeUpdateEvent, [updateData])
							}
							else if(error.request.status === 422 ){
								this.errorToast.msg = "Não foi possível atualizar esse evento. Por favor tente novamente."
								this.errorToast.el.show()
							}
							else if(error.request.status === 500){
								this.errorToast.msg = "Não foi possível se conectar com o servidor."
								this.errorToast.el.show()
							}
						}
						else if(error.request) {
							if(error.code === "ERR_NETWORK") {
								this.errorToast.msg = "Esse cliente não consegue se conectar com a internet."
								this.errorToast.el.show()
							}
							else {
								console.log(error)
								this.errorToast.msg = "Um erro inesperado aconteceu. Por favor, recarregue a página e tente novamente."
								this.errorToast.el.show()
							}
						}
						else {
							console.log(error)
							this.errorToast.msg = "Um erro inesperado aconteceu. Por favor, recarregue a página e tente novamente."
							this.errorToast.el.show()
						}
					}).finally(() => {
						//libera a possibilidade de atualizar novamente
						this.editRequest = null
					})
				}
				
			},
			onBeforeDeleteEvent({ title, id, calendarId }) {
				console.group("onBeforeDeleteEvent");
				console.log("Event Info : ", title);
				console.groupEnd();

				this.calendarInstance.deleteEvent(id, calendarId);
			},
			onClickEvent({ event }) {

				this.selectedEvent.internalEvent = this.events.find((e) => e.id === event.id)
				
				this.selectedEvent.description = this.selectedEvent.internalEvent.title
				this.selectedEvent.label = this.selectedEvent.internalEvent.label
				this.selectedEvent.startDate = this.selectedEvent.internalEvent.startDate
				this.selectedEvent.endDate = this.selectedEvent.internalEvent.endDate
				this.selectedEvent.bgColor = this.selectedEvent.internalEvent.backgroundColor
				this.selectedEvent.campi = this.selectedEvent.internalEvent.campi
				this.selectedEvent.id = this.selectedEvent.internalEvent.id

				this.resetEditForm()
				this.eventEditModal.show()
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
			parseCampiFromStore(campiList) {
				campiList.forEach( (campus) => {
					this.campi.push({
						value: campus.id,
						label: campus.name
					})
				})
			},
			resetEditForm() {
				this.eEFormInputFeedbacks.description = ""
				this.eEFormInputFeedbacks.label = ""
				this.eEFormInputFeedbacks.campi = ""
				this.eEFormInputFeedbacks.endDate = ""
				this.eEFormInputFeedbacks.startDate = ""
				this.eEFormInputFeedbacks.bgColor = ""

				this.$refs.eEDescription.resetValidation()
				this.$refs.eELabel.resetValidation()

				if(this.selectedEvent.label != "H") {
					this.$refs.eECampi.resetValidation()
				}
				
				this.$refs.eEEndDate.resetValidation()
				this.$refs.eEStartDate.resetValidation()
				this.$refs.eEColor.resetValidation()
			},
			downloadCalendar(format) {
				var paths = new Map()
				paths.set("csv", '/csv')
				paths.set("xlsx", '/excel')

				var path = paths.get(format)

				this.infoToast.el.show()

				axios.post(`/api/academic-calendar/calendar/${this.$route.params.id}/export${path}`, undefined,
					{
						headers: {
							Authorization: "Bearer " + this.userAuthInfoStore.token
						}
					}
				).then((response) => {
					this.downloadFile(response.data.url, format);

				}).catch((error) => {
					if(error.response) {
                        if(error.request.status === 401) {
                            refreshUserAuthToken(this.downloadCalendar, [format])
							//TODO Exibir um toast quando o usuário for redirecionado pro login
                        }
                        else if(error.request.status === 500){
                            this.errorToast.msg = "Não foi possível se conectar com o servidor."
                            this.errorToast.el.show()
                        }
                    }
                    else if(error.request) {
                        if(error.code === "ERR_NETWORK") {
                            this.errorToast.msg = "Esse cliente não consegue se conectar com a internet."
                            this.errorToast.el.show()
                        }
                    }
                    else {
                        console.log(error)
                        this.errorToast.msg = "Um erro inesperado aconteceu. Por favor, recarregue a página e tente novamente."
                        this.errorToast.el.show()
                    }
				})
			},
			downloadFile(fileURL, fileType) {
				axios.get(`/api${fileURL}`, 
				{
					headers: {
						Authorization: "Bearer " + this.userAuthInfoStore.token
					},
					responseType: 'blob'
				})
				.then( async (res) => {

					var options = {
						suggestedName: `planilha.${fileType}`,
						types: null
					};

					if(fileType === "csv") {
						options.types = [{
							description: '.csv',
							accept: { 'text/csv' : ['.csv'] },
						}]
					}
					else if(fileType === "xlsx") {
						options.types = [{
							description: '.xlsx',
							accept: { 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' : ['.xlsx'] },
						}]
					}
					else if(fileType === "pdf") {
						options.suggestedName = "Arquivo PDF do calendário"
						options.types = [{
							description: '.pdf',
							accept: { 'application/pdf' : ['.pdf'] },
						}]
					}

					const handle = await window.showSaveFilePicker(options);
					const writable = await handle.createWritable();
					await writable.write(res.data)
					await writable.close()

					this.infoToast.el.hide()

				}).catch((error) => {
					this.infoToast.el.hide()
					if(error.response) {
                        if(error.request.status === 401) {
                            refreshUserAuthToken(this.downloadFile, [fileURL, fileType])
                        }
                        else if(error.request.status === 500){
                            this.errorToast.msg = "Não foi possível se conectar com o servidor."
                            this.errorToast.el.show()
                        }
                    }
                    else if(error.request) {
                        if(error.code === "ERR_NETWORK") {
                            this.errorToast.msg = "Esse cliente não consegue se conectar com a internet."
                            this.errorToast.el.show()
                        }
                    }
					else if(error.name !== undefined && error.name === 'AbortError') {
						//a ideia aqui é justamente não fazer nada, mas não cair no próximo else
						console.log("File saving aborted.")
					}
                    else {
                        this.errorToast.msg = "Um erro inesperado aconteceu. Por favor, recarregue a página e tente novamente."
                        this.errorToast.el.show()
                    }
				})
			},
			handleFileChange(event) {
				this.selectedFile = event.target.files[0];
			},
			importEvents() {
				if (this.selectedFile) {
					this.importingError.isErrored = false

					const formData = new FormData();
					formData.append('file', this.selectedFile);
					
					axios.post(`/api/academic-calendar/calendar/${this.calendar.id}/import_events`, formData, 
					{
						headers: {
							Authorization: "Bearer " + this.userAuthInfoStore.token
						}
					}
				).then((_) => {
					this.events = []

					this.getEvents()

					this.importingModal.hide()

					this.sucessToast.msg = "Eventos importados com sucesso!"

					this.sucessToast.el.show()

				}).catch((error) => {
					if(error.response) {
                        if(error.request.status === 401) {
                            refreshUserAuthToken(this.importEvents)
							//TODO Exibir um toast quando o usuário for redirecionado pro login
                        }
                        else if(error.request.status === 422 ){
							this.importingError.isErrored = true
							this.importingError.messages = error.response.data.errors
                        }
						else if(error.request.status === 400 ){
							this.errorToast.msg = "Verifique se você selecionou um arquivo no formato Excel(.xlsx)."
                            this.errorToast.el.show()
                        }
						else if(error.request.status === 404 ){
							this.$router.push({ name: 'not-found' })
                        }
                        else if(error.request.status === 500){
                            this.errorToast.msg = "Não foi possível se conectar com o servidor."
                            this.errorToast.el.show()
                        }
                    }
                    else if(error.request) {
                        if(error.code === "ERR_NETWORK") {
                            this.errorToast.msg = "Esse cliente não consegue se conectar com a internet."
                            this.errorToast.el.show()
                        }
                    }
                    else {
                        console.log(error)
                        this.errorToast.msg = "Um erro inesperado aconteceu. Por favor, recarregue a página e tente novamente."
                        this.errorToast.el.show()
                    }
				})
					
				} else {
					this.errorToast.msg = "É necessário escolher um arquivo."
					this.errorToast.el.show()
				}
			},
			formatDate(date) {
				const year = date.getFullYear(); 
				const month = String(date.getMonth() + 1).padStart(2, '0'); 
				const day = String(date.getDate()).padStart(2, '0');
				return `${year}-${month}-${day}`
			}
		},
		components: {
			ToastUICalendar,
			BaseButton,
			BaseModal,
			BaseForm,
			FloatingInput,
			BaseSelectInput,
			BaseLabel,
			ColorPicker,
			BaseToastContainer,
			BaseToast,
			FormInputFeedback,
            DropdownButton,
			TextTitle1,
			TextTitle5,
			MultipleSelectInput,
			BaseUnorderedList,
			BaseListItem,
			BaseTable,
			BaseTHead,
			BaseTBody,
			BaseTH,
			BaseInput,
			BaseAnchor,
			BaseCallout,
			ToolBar,
			ToolBarItem,
			Page,
			EmptyState,
			ButtonGroup,
			IconNextArrow,
			IconPrevArrow,
			PlusIcon,
			DropdownMenu,
			DropdownItem
		},
	};
</script>
