<template lang="pug">

  // center-card-three-quarter
  card-full

    // hides logo
    span(slot="form-logo")

    h5.no-margin(slot="form-title")
      div(v-if="state == 'manage-profile'")
        span.text-grey-6 {{ $t('routes.users.manage.title') }}
        br
        | {{ $t('routes.users.manage.caption') }}
        div(v-if="isFirst")
          br
          | {{ $t('routes.users.manage.first_login') }}
      div(v-else)
        span.text-grey-6 {{ $t('routes.users.first_login.title') }}
        br
        | {{ $t('routes.users.first_login.caption') }}

    // form-main(v-if="payload !== undefined", v-model="payload", :schema="schema")
    form-main(v-model="payload", :schema="schema")
      q-btn.q-mr-md.bg-grey-9(v-if="!isFirst", slot="form-buttons-add", label="close account")

</template>

<script>
  import CardFull from 'mbjs-quasar/src/components/layouts/CardFull'
  import { FormMain } from 'mbjs-quasar/src/components/forms'
  // import { required, sameAs, minLength, email } from 'vuelidate/lib/validators'
  import { required, minLength } from 'vuelidate/lib/validators'
  export default {
    components: {
      CardFull,
      FormMain
    },
    mounted () {
      this.isFirst = this.$route.params.isFirst
    },
    data () {
      const context = this
      return {
        isFirst: false,
        state: 'manage-profile',
        schema: {
          fields: {
            name: {
              type: 'text',
              label: 'labels.name',
              errorLabel: 'errors.field_required',
              validators: {
                required,
                minLength: minLength(2)
              }
            },
            organisation: {
              type: 'text',
              label: 'labels.organisation'
            }
          },
          submit: {
            handler () {
              return context.$store.dispatch('profiles/patch', [context.$store.state.auth.user.uuid, context.payload]).then(() => {
                return context.$store.dispatch('profiles/get', context.$store.state.auth.user.uuid)
              }).then(profile => {
                const user = context.$store.state.auth.user
                user.profile = profile
                context.$store.commit('auth/setUser', user)
                localStorage.setItem('user', JSON.stringify(user))
              }).then(() => {
                if (context.$route.params.isFirst && context.$route.params.redirect) {
                  context.$router.push(context.$route.params.redirect.fullPath)
                }
              })
            },
            label: 'buttons.save',
            message: 'messages.update_success'
          }
        },
        payload: context.$store.dispatch('profiles/get', context.$store.state.auth.user.uuid)
      }
    }
  }
</script>

<style></style>
