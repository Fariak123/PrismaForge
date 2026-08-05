export function getArrayArgument(args: any[], name: string): string[] {
  const argument = args.find(
    (arg) => arg.kind === 'namedArgument' && arg.name.value === name,
  );

  if (!argument) {
    return [];
  }

  return argument.expression.items.map((item: any) => item.value[0]);
}
