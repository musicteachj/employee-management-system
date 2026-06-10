<template>
  <div class="auth-shell">
    <!-- Brand panel -->
    <aside class="auth-brand">
      <div class="auth-brand-top">
        <div class="auth-brand-tile">
          <v-icon size="22" color="#EAB308">mdi-account-group</v-icon>
        </div>
        <div class="auth-brand-lockup">
          <span class="auth-brand-name">EMS</span>
          <span class="auth-brand-sub">Employee Console</span>
        </div>
      </div>

      <div class="auth-brand-mid">
        <h1 class="auth-headline">
          Get started in<br />a few seconds.
        </h1>
        <p class="auth-subhead">
          Create your account to manage employees, track performance, and see
          your organization at a glance.
        </p>
        <ul class="auth-features">
          <li>
            <v-icon size="18" color="#818CF8">mdi-check-circle</v-icon>
            Centralized employee records
          </li>
          <li>
            <v-icon size="18" color="#818CF8">mdi-check-circle</v-icon>
            Bulk actions &amp; smart segments
          </li>
          <li>
            <v-icon size="18" color="#818CF8">mdi-check-circle</v-icon>
            Insightful workforce analytics
          </li>
        </ul>
      </div>

      <div class="auth-brand-foot">
        © {{ new Date().getFullYear() }} Employee Management System
      </div>
    </aside>

    <!-- Form panel -->
    <main class="auth-form-wrap">
      <div class="auth-form">
        <div class="auth-form-head">
          <h2 class="auth-title">Create account</h2>
          <p class="auth-desc">Set up your console access in one step.</p>
        </div>

        <v-alert
          v-if="authStore.error"
          type="error"
          variant="tonal"
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
            prepend-inner-icon="mdi-account-outline"
            :error-messages="fullNameError"
            required
            variant="outlined"
            density="comfortable"
            class="mb-3"
            color="primary"
          ></v-text-field>

          <v-text-field
            v-model="email"
            label="Email"
            type="email"
            prepend-inner-icon="mdi-email-outline"
            :error-messages="emailError"
            required
            variant="outlined"
            density="comfortable"
            class="mb-3"
            color="primary"
          ></v-text-field>

          <v-text-field
            v-model="password"
            label="Password"
            :type="showPassword ? 'text' : 'password'"
            prepend-inner-icon="mdi-lock-outline"
            :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append-inner="showPassword = !showPassword"
            :error-messages="passwordError"
            required
            variant="outlined"
            density="comfortable"
            class="mb-1"
            color="primary"
          ></v-text-field>
          <p class="auth-hint">
            At least 8 characters with uppercase, lowercase, and a number.
          </p>

          <v-btn
            type="submit"
            color="primary"
            block
            size="large"
            :loading="authStore.isLoading"
            class="mt-3"
          >
            Create account
          </v-btn>
        </v-form>

        <div class="auth-foot">
          Already have an account?
          <router-link to="/login" class="auth-link">Sign in</router-link>
        </div>
      </div>
    </main>
  </div>
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

<style scoped></style>
