<template>
  <div class="app d-flex flex-row align-items-center">
    <b-container>

      <Loading v-if="loading" />

      <b-row v-else-if="done" class="justify-content-center">
        <b-col md="8" sm="8">
          <b-card class="mx-4 text-center">
            <p class="lead">An email has been sent to {{email}}</p>

            <small>
              Didn't get the email? Check your spam filter or <b-button size="sm" variant="link" @click="resetForm()" class="px-0">send another link</b-button>
            </small>
          </b-card>
        </b-col>
      </b-row>

      <b-row v-else class="justify-content-center">
        <b-col md="8" sm="8">
          <b-card no-body class="mx-4">
            <b-card-body class="p-4">
              <b-form>
                <h1>Reset Password</h1>
                <p class="text-muted">We'll email a magic link to you</p>

                <b-form-group
                  id="email-fieldset"
                  label="Email"
                  label-for="email-input"
                >
                  <b-form-input
                    id="email-input"
                    autocomplete="email"
                    placeholder="Email"
                    :value="email"
                    @input="setEmail"
                  />
                </b-form-group>

                <p v-if="error" class="error">Bad EMAIL information</p>

                <b-button variant="outline-primary" block @click="reset()">
                  Reset Password
                </b-button>

              </b-form>
            </b-card-body>
          </b-card>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import Loading from '@/components/Loading'
import { mapGetters, mapActions, mapMutations } from 'vuex'

export default {
  name: 'Reset',
  metaInfo: {
    title: 'Reset Password'
  },
  components: {
    Loading
  },
  computed: mapGetters({
    loading: 'auth/reset/loading',
    email: 'auth/reset/email',
    error: 'auth/reset/error',
    done: 'auth/reset/done'
  }),
  methods: {
    ...mapActions({
      reset: 'auth/reset/post',
      resetForm: 'auth/reset/resetForm'
    }),
    ...mapMutations({
      setEmail: 'auth/reset/email'
    })
  }
}
</script>
