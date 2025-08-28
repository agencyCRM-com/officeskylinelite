<script lang="ts">
  import { supabase } from '$lib/supabase';
  
  let email = '';
  let password = '';
  let error = '';
  let loading = false;

  async function handleLogin() {
    try {
      loading = true;
      error = '';
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) throw signInError;
    } catch (err: any) {
      error = err.message;
    } finally {
      loading = false;
    }
  }

  async function handleSignUp() {
    try {
      loading = true;
      error = '';
      const { error: signUpError } = await supabase.auth.signUp({ email, password });
      if (signUpError) throw signUpError;
      alert('Check your email for the confirmation link!');
    } catch (err: any) {
      error = err.message;
    } finally {
      loading = false;
    }
  }
</script>

<div class="auth-container">
  <h1>Virtual Office Lite</h1>
  <div class="form-container">
    <input type="email" bind:value={email} placeholder="Email" />
    <input type="password" bind:value={password} placeholder="Password" />
    {#if error}<div class="error">{error}</div>{/if}
    <button on:click={handleLogin} disabled={loading}>Sign In</button>
    <button on:click={handleSignUp} disabled={loading}>Sign Up</button>
    <p style="text-align: center; margin-top: 1rem; font-size: 0.9rem;">
      Demo: You can use any email/password (it will create an account)
    </p>
  </div>
</div>

<style>
  .auth-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    background: linear-gradient(135deg, #6e8efb, #a777e3);
  }
  
  .form-container {
    background: white;
    padding: 2rem;
    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    gap: 1rem;
    min-width: 300px;
  }
  
  input {
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 5px;
  }
  
  button {
    padding: 0.75rem;
    background: #4a6fa5;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  button:hover:not(:disabled) {
    background: #166088;
  }
  
  button:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
  
  .error {
    color: red;
    font-size: 0.9rem;
    text-align: center;
  }
</style>