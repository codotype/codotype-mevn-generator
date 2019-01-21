<template>
  <div class="app d-flex flex-row align-items-center">
    <b-container>
      <Loading v-if="loading" />
      <b-row class="justify-content-center">
        <b-col md="8" sm="8">
          <b-card no-body class="mx-4">
            <b-card-body class="p-4">
              <b-form>
                <h1>Reset Password</h1>
                <p class="text-muted">Reset your password below</p>

                <b-form-group
                  id="password-input"
                  label="Password"
                  label-for="password-input"
                  :horizontal="true"
                >
                  <b-form-input
                    type="password"
                    id="password-input"
                    autocomplete="new-password"
                    placeholder="Password"
                    :value="password"
                    @input="setPassword"
                  />
                </b-form-group>

                <b-form-group
                  label="Repeat Password"
                  label-for="password-verify-input"
                  :horizontal="true"
                >
                  <b-form-input
                    type="password"
                    id="password-verify-input"
                    autocomplete="new-password"
                    placeholder="Repeat password"
                    :value="password_verify"
                    @input="setPasswordVerify"
                  />
                </b-form-group>

                <p v-if="error" class="error">Bad EMAIL information</p>

                <b-button :disabled="verified" variant="outline-primary" block @click="resetPassword()">
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
  mounted () {
    const { token } = this.$route.query
    if (token) {
      this.$store.commit('auth/reset_password/password_reset_token', token )
    } else {
      this.$router.push('/auth/login')
    }
  },
  computed: mapGetters({
    loading: 'auth/reset_password/loading',
    password: 'auth/reset_password/password',
    password_verify: 'auth/reset_password/password_verify',
    error: 'auth/reset_password/error',
    verified: 'auth/reset_password/verified',
    done: 'auth/reset_password/done'
  }),
  methods: {
    ...mapActions({
      resetPassword: 'auth/reset_password/post',
      resetForm: 'auth/reset_password/resetForm'
    }),
    ...mapMutations({
      setPassword: 'auth/reset_password/password',
      setPasswordVerify: 'auth/reset_password/password_verify'
    })
  }
}
</script>
