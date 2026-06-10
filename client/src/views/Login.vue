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
          Your workforce,<br />in one clear view.
        </h1>
        <p class="auth-subhead">
          Hiring, performance, org structure, and reporting — managed from a
          single enterprise console.
        </p>
        <ul class="auth-features">
          <li>
            <v-icon size="18" color="#818CF8">mdi-check-circle</v-icon>
            Real-time headcount &amp; analytics
          </li>
          <li>
            <v-icon size="18" color="#818CF8">mdi-check-circle</v-icon>
            Performance review tracking
          </li>
          <li>
            <v-icon size="18" color="#818CF8">mdi-check-circle</v-icon>
            Org chart &amp; reporting lines
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
          <h2 class="auth-title">Sign in</h2>
          <p class="auth-desc">Welcome back. Enter your credentials to continue.</p>
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

        <!-- Demo Credentials Info -->
        <div class="demo-box">
          <div>
            <div class="demo-title">Demo credentials</div>
            <div class="demo-creds">
              test@example.com&nbsp;·&nbsp;Test123!
            </div>
          </div>
          <v-btn
            color="primary"
            variant="tonal"
            size="small"
            @click="fillDemoCredentials"
          >
            Use demo
          </v-btn>
        </div>

        <v-form @submit.prevent="handleLogin">
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
            class="mb-2"
            color="primary"
          ></v-text-field>

          <v-btn
            type="submit"
            color="primary"
            block
            size="large"
            :loading="authStore.isLoading"
            class="mt-3"
          >
            Sign in
          </v-btn>
        </v-form>

        <div class="auth-foot">
          Don't have an account?
          <router-link to="/register" class="auth-link">Create one</router-link>
        </div>
      </div>
    </main>
  </div>
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

// Fill demo credentials
const fillDemoCredentials = () => {
  email.value = "test@example.com";
  password.value = "Test123!";
};

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

<style scoped></style>
