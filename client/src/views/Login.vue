<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card elevation="8" class="pa-4">
          <v-card-title class="text-h4 text-center text-primary mb-4">
            <v-icon
              icon="mdi-account-circle"
              size="large"
              class="mr-2"
              color="primary"
            ></v-icon>
            Login
          </v-card-title>

          <v-card-text>
            <v-alert
              v-if="authStore.error"
              type="error"
              class="mb-4"
              closable
              @click:close="authStore.clearError()"
            >
              {{ authStore.error }}
            </v-alert>

            <v-form @submit.prevent="handleLogin">
              <v-text-field
                v-model="email"
                label="Email"
                type="email"
                prepend-icon="mdi-email"
                :error-messages="emailError"
                required
                variant="outlined"
                class="mb-2"
                color="primary"
              ></v-text-field>

              <v-text-field
                v-model="password"
                label="Password"
                :type="showPassword ? 'text' : 'password'"
                prepend-icon="mdi-lock"
                :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append-inner="showPassword = !showPassword"
                :error-messages="passwordError"
                required
                variant="outlined"
                class="mb-2"
                color="primary"
              ></v-text-field>

              <v-btn
                type="submit"
                color="primary"
                block
                size="large"
                :loading="authStore.isLoading"
                class="mt-4"
              >
                Login
              </v-btn>
            </v-form>

            <v-divider class="my-6"></v-divider>

            <div class="text-center">
              <p class="text-body-2">
                Don't have an account?
                <router-link
                  to="/register"
                  class="text-primary text-decoration-none"
                >
                  Register here
                </router-link>
              </p>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from "../stores/auth";
import { useField, useForm } from "vee-validate";
import { loginSchema } from "../schemas/auth";
import { toTypedSchema } from "@vee-validate/zod";

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const showPassword = ref(false);

// Form validation setup
const { handleSubmit } = useForm({
  validationSchema: toTypedSchema(loginSchema),
});

const { value: email, errorMessage: emailError } = useField<string>("email");
const { value: password, errorMessage: passwordError } =
  useField<string>("password");

const handleLogin = handleSubmit(async (values) => {
  const success = await authStore.login({
    email: values.email,
    password: values.password,
  });

  if (success) {
    // Redirect to the page user was trying to access, or home
    const redirect = (route.query.redirect as string) || "/";
    router.push(redirect);
  }
});
</script>

<style scoped>
.v-card {
  border-radius: 16px;
}
</style>
