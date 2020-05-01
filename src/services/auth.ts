interface Response {
  token: string;
  user: {
    name: string;
    email: string;
  };
}

export function signIn(): Promise<Response> {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        token: 'iajsidjajsodadjasjdasjdafpksdp',
        user: {
          name: 'Carlos',
          email: 'carlos@teste.com',
        },
      });
    }, 2000);
  });
}
