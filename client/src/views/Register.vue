<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="6" lg="5">
        <v-card elevation="8" class="pa-4">
          <v-card-title class="text-h4 text-center text-primary mb-4">
            <v-icon icon="mdi-account-plus" size="large" class="mr-2"></v-icon>
            Register
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

            <v-form @submit.prevent="handleRegister">
              <v-text-field
                v-model="full_name"
                label="Full Name"
                prepend-icon="mdi-account"
                :error-messages="fullNameError"
                required
                variant="outlined"
                class="mb-2"
                color="primary"
              ></v-text-field>

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
                hint="Must be at least 8 characters with uppercase, lowercase, and number"
                persistent-hint
                color="primary"
              ></v-text-field>

              <v-btn
                type="submit"
                color="primary"
                block
                size="large"
                :loading="authStore.isLoading"
                class="mt-6"
              >
                Register
              </v-btn>
            </v-form>

            <v-divider class="my-6"></v-divider>

            <div class="text-center">
              <p class="text-body-2">
                Already have an account?
                <router-link
                  to="/login"
                  class="text-primary text-decoration-none"
                >
                  Login here
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
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";
import { useField, useForm } from "vee-validate";
import { registerSchema } from "../schemas/auth";
import { toTypedSchema } from "@vee-validate/zod";

const router = useRouter();
const authStore = useAuthStore();

const showPassword = ref(false);

// Form validation setup
const { handleSubmit } = useForm({
  validationSchema: toTypedSchema(registerSchema),
});

const { value: full_name, errorMessage: fullNameError } =
  useField<string>("full_name");
const { value: email, errorMessage: emailError } = useField<string>("email");
const { value: password, errorMessage: passwordError } =
  useField<string>("password");

const handleRegister = handleSubmit(async (values) => {
  const success = await authStore.register({
    email: values.email,
    password: values.password,
    full_name: values.full_name,
    is_admin: false,
  });

  if (success) {
    router.push("/");
  }
});
</script>

<style scoped>
.v-card {
  border-radius: 16px;
}
</style>
