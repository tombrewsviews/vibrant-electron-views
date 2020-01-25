if (
  !/https?:\/\/(localhost|api\.staging\.)/.test(process.env.HASURA_GRAPHQL_ENDPOINT)
) {
  console.error(
    `Can only run sample data against localhost and staging. Your API is "${process.env.HASURA_GRAPHQL_ENDPOINT}"`
  )
  process.exit(1)
}
