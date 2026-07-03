import assert from "assert";
import test, { describe, it } from "node:test";
import * as listService from '../listService'

  test('listService test', async (t) => {
  // // The setTimeout() in the following subtest would cause it to outlive its
  // // parent test if 'await' is removed on the next line. Once the parent test
  // // completes, it will cancel any outstanding subtests.
  // await t.test('creates a list', async (t) => {
  //   const list = await listService.createList({ id: 'String', title: 'Test', content:[], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), ownerId: null });
  //   assert(list.id)
  //   assert(list.title, 'Test')
  // });
});