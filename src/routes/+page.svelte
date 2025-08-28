<script lang="ts">
  import { onMount } from 'svelte';
  import { supabase } from '$lib/supabase';
  import { page } from '$app/stores';

  // User and UI state
  let user: any = null;
  let officeLayout = [
    ['desk', 'desk', 'desk', 'empty', 'meeting', 'meeting'],
    ['desk', 'desk', 'desk', 'empty', 'meeting', 'meeting'],
    ['desk', 'desk', 'desk', 'empty', 'empty', 'empty'],
    ['empty', 'empty', 'empty', 'empty', 'empty', 'empty'],
    ['desk', 'desk', 'empty', 'kitchen', 'kitchen', 'kitchen'],
    ['desk', 'desk', 'empty', 'kitchen', 'kitchen', 'kitchen']
  ];

  // Sample users data
  const users = [
    { id: 1, name: "You", avatar: "Y", muted: false },
    { id: 2, name: "Alex Johnson", avatar: "A", muted: true },
    { id: 3, name: "Maria Garcia", avatar: "M", muted: false },
    { id: 4, name: "David Kim", avatar: "D", muted: true },
    { id: 5, name: "Sarah Williams", avatar: "S", muted: false }
  ];

  onMount(async () => {
    // Get current user
    const { data: { user: currentUser } } = await supabase.auth.getUser();
    user = currentUser;

    // Redirect to login if not authenticated
    if (!user) {
      window.location.href = '/login';
    }

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        window.location.href = '/login';
      }
    });

    return () => subscription.unsubscribe();
  });

  function handleTileClick(row: number, col: number) {
    const tileType = officeLayout[row][col];
    if (tileType !== 'empty') {
      alert(`Entering ${tileType} room at position (${row}, ${col})`);
    }
  }

  function toggleAudio(userId: number) {
    const user = users.find(u => u.id === userId);
    if (user) {
      user.muted = !user.muted;
      showNotification(`${user.name} ${user.muted ? 'muted' : 'unmuted'}`);
    }
  }

  function shareScreen(userId: number) {
    const user = users.find(u => u.id === userId);
    showNotification(`${user.name} is ${user.name === 'You' ? 'sharing' : 'viewing'} screen`);
  }

  function showNotification(message: string) {
    // Implementation for notifications would go here
    console.log(message);
  }

  async function signOut() {
    await supabase.auth.signOut();
  }
</script>

{#if user}
  <div class="office-container">
    <header>
      <div class="logo">Virtual Office Lite</div>
      <div class="user-info">
        <div class="avatar">{user.email?.charAt(0).toUpperCase() || 'U'}</div>
        <span>{user.email}</span>
        <button on:click={signOut}>Sign Out</button>
      </div>
    </header>
    
    <div class="main-content">
      <h2 class="room-title">Main Office Room</h2>
      
      <div class="office-grid">
        {#each officeLayout as row, rowIndex}
          {#each row as tile, colIndex}
            <div 
              class="tile {tile}" 
              on:click={() => handleTileClick(rowIndex, colIndex)}
            >
              {#if tile === 'desk'}
                🪑
              {:else if tile === 'meeting'}
                📊
              {:else if tile === 'kitchen'}
                ☕
              {:else}
                &nbsp;
              {/if}
            </div>
          {/each}
        {/each}
      </div>

      <h3 style="margin: 20px 0 10px 0;">Team Members</h3>
      <div class="users-grid">
        {#each users as user}
          <div class="user-tile">
            <div class="user-avatar">{user.avatar}</div>
            <div class="user-name">{user.name}</div>
            <div class="controls">
              <button class:audio-btn={true} class:muted={user.muted} on:click={() => toggleAudio(user.id)}>
                {user.muted ? 'Unmute' : 'Mute'}
              </button>
              <button class="screen-share-btn" on:click={() => shareScreen(user.id)}>
                Share Screen
              </button>
            </div>
          </div>
        {/each}
      </div>
    </div>
    
    <div class="status-bar">
      <p>Click on a room to enter. Next steps: audio and screen sharing implementation.</p>
    </div>
  </div>
{/if}

<style>
  .office-container {
    height: 100vh;
    display: flex;
    flex-direction: column;
    background: #f5f7fa;
  }

  header {
    background: #4a6fa5;
    color: white;
    padding: 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .logo {
    font-size: 1.5rem;
    font-weight: bold;
  }

  .user-info {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .avatar {
    width: 40px;
    height: 40px;
    background: #166088;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
  }

  button {
    padding: 0.5rem 1rem;
    background: #166088;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
  }

  button:hover {
    background: #0f4c6e;
  }

  .main-content {
    flex: 1;
    padding: 1rem;
    overflow: auto;
  }

  .room-title {
    text-align: center;
    margin-bottom: 1.5rem;
    color: #4a6fa5;
  }

  .office-grid {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    grid-template-rows: repeat(6, 1fr);
    gap: 4px;
    margin-bottom: 2rem;
    max-width: 600px;
    margin: 0 auto 2rem auto;
  }

  .tile {
    aspect-ratio: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    font-size: 24px;
    cursor: pointer;
    transition: transform 0.2s;
  }

  .tile:hover {
    transform: scale(1.05);
  }

  .desk {
    background: #e9ecef;
    border: 2px solid #adb5bd;
  }

  .meeting {
    background: #d8f3dc;
    border: 2px solid #40916c;
  }

  .kitchen {
    background: #ffddd2;
    border: 2px solid #e29578;
  }

  .empty {
    background: #f8f9fa;
    border: 1px dashed #dee2e6;
  }

  .users-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1rem;
    margin-top: 1rem;
  }

  .user-tile {
    background: white;
    border-radius: 10px;
    padding: 1rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .user-avatar {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: #6e8efb;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    color: white;
    margin-bottom: 0.5rem;
  }

  .user-name {
    font-weight: bold;
    margin-bottom: 1rem;
  }

  .controls {
    display: flex;
    gap: 0.5rem;
  }

  .audio-btn {
    background: #4a6fa5;
  }

  .audio-btn.muted {
    background: #dc3545;
  }

  .screen-share-btn {
    background: #28a745;
  }

  .status-bar {
    padding: 1rem;
    background: #e9ecef;
    text-align: center;
    font-size: 0.9rem;
    color: #666;
  }
</style>