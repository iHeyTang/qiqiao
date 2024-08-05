<template>
  <div class="nav-tree">
    <ul>
      <li v-for="link in props.links" :key="link.to.toString()">
        <ULink :class="linkClass(link.to)" :to="link.to">
          {{ link.label }}
        </ULink>
        <template v-if="link.children" :active="path === link.to">
          <ul>
            <li
              v-for="child in link.children"
              :key="child.to.toString()"
              style="
                margin-left: 24px;
                border-left: 1px solid var(--primary-color);
              "
            >
              <ULink :class="linkClass(child.to)" :to="child.to">
                {{ child.label }}
              </ULink>
            </li>
          </ul>
        </template>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import type { VerticalNavigationLink } from "#ui/types";

export type NavigationTreeLink = VerticalNavigationLink & {
  children?: NavigationTreeLink[];
  to: NonNullable<VerticalNavigationLink["to"]>;
};

const props = defineProps<{
  links: NavigationTreeLink[];
  defaultOpen?: boolean;
  multiple?: boolean;
}>();

const route = useRoute();

const linkClass = (to: NavigationTreeLink["to"]) => {
  return `link ${route.path === to ? "active" : ""}`;
};
</script>

<style>
.nav-tree {
  padding: 0;
  margin: 0;
  list-style: none;
}

.nav-tree .link {
  display: block;
  padding: 8px 16px;
  transition: 0.3s;
}

.nav-tree .link.active {
  color: var(--primary-color);
}
.nav-tree .link:hover {
  color: var(--primary-color);
}
</style>
